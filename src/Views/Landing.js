import React, { useState, useMemo, useCallback } from 'react';
import {
  Form, Input, List, Tag, Space, Button,
} from 'antd';
import { DeleteOutlined, ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { v4 as uuidv4 } from 'uuid';

const sortString = (a, b) => {
  if (a.text < b.text) {
    return -1;
  }
  if (b.text < a.text) {
    return 1;
  }
  return 0;
};

const Landing = () => {
  const [arr, setArr] = useState([]);
  const onChange = (values) => {
    const meetingKeywords = values.meeting ? values.meeting.split(',').map((item) => item.trim()) : ['syncup', '1o1', '1 on 1'];

    console.log({ meetingKeywords });
    if (values.input) {
      const x = values.input.split('\n');
      const test = /\d{2}\.\d{2}/g;
      setArr(x.map((value) => {
        const matches = value.match(test);
        const start = dayjs().set('hour', Number(matches[0].split('.')[0])).set('minute', Number(matches[0].split('.')[1]));
        const end = dayjs().set('hour', Number(matches[1].split('.')[0])).set('minute', Number(matches[1].split('.')[1]));
        return ({
          id: uuidv4(),
          text: value.replace(`${matches[0]} - ${matches[1]}`, '').trim(),
          startTime: start,
          endTime: end,
          timespan: end.diff(start, 'minute'),
          type: meetingKeywords.some((keyword) => value.toLowerCase().includes(keyword)) ? 'meeting' : 'individual',
        });
      }));
    }
  };

  const onClickRemove = useCallback((id) => {
    setArr((curr) => curr.filter((item) => item.id !== id));
  }, [setArr]);

  const onClickSwitch = useCallback((id) => {
    setArr((curr) => {
      const temp = [...curr];
      const idx = curr.findIndex((item) => item.id === id);
      let future = '';
      if (temp[idx].type === 'meeting') {
        future = 'individual';
      } else {
        future = 'meeting';
      }
      temp[idx] = {
        ...temp[idx],
        type: future,
      };
      return temp;
    });
  }, [setArr]);

  const totalMeetingTime = useMemo(() => arr.filter((item) => item.type === 'meeting').reduce((prev, curr) => prev + curr.timespan, 0), [arr]);

  const totalIndividualTime = useMemo(() => arr.filter((item) => item.type === 'individual').reduce((prev, curr) => prev + curr.timespan, 0), [arr]);

  return (
    <Space style={{ width: '100%' }} direction="vertical">
      <Form onFinish={onChange} initialValues={{ meeting: 'syncup,1o1,1 on 1' }}>
        <Form.Item name="input" label="Schedule">
          <Input.TextArea />
        </Form.Item>
        <Form.Item name="meeting" label="Meeting Keywords">
          <Input />
        </Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form>
      <Space style={{ width: '100%' }} size="small" direction="vertical">
        <List
          header={(
            <strong>
              Meeting
              {' '}
              <Tag>{totalMeetingTime}</Tag>
              {' '}
              <Tag>{`${Math.ceil((totalMeetingTime / 60) * 2) / 2} hours`}</Tag>
            </strong>
)}
          size="small"
          bordered
          dataSource={arr.filter((item) => item.type === 'meeting').sort(sortString)}
          renderItem={(item) => (
            <List.Item>
              <div style={{ display: 'flex', width: '100%' }}>
                <div>{item.text}</div>
                <div style={{ flex: 1, textAlign: 'right' }}>
                  <Tag style={{ margin: '0 0 0 8' }}>
                    {`${item.timespan} minutes`}
                  </Tag>
                  <Space size="small">
                    <DeleteOutlined onClick={() => onClickRemove(item.id)} />
                    <ArrowDownOutlined onClick={() => onClickSwitch(item.id)} />
                  </Space>
                </div>
              </div>
            </List.Item>
          )}
        />

        <List
          header={(
            <strong>
              Individual
              {' '}
              <Tag>{totalIndividualTime}</Tag>
              {' '}
              <Tag>{`${Math.ceil((totalIndividualTime / 60) * 2) / 2} hours`}</Tag>
            </strong>
          )}
          size="small"
          bordered
          dataSource={arr.filter((item) => item.type === 'individual').sort(sortString)}
          renderItem={(item) => (
            <List.Item>
              <div style={{ display: 'flex', width: '100%' }}>
                <div>{item.text}</div>
                <div style={{ flex: 1, textAlign: 'right' }}>
                  <Tag style={{ margin: '0 0 0 8' }}>
                    {`${item.timespan} minutes`}
                  </Tag>
                  <Space size="small">
                    <DeleteOutlined onClick={() => onClickRemove(item.id)} />
                    <ArrowUpOutlined onClick={() => onClickSwitch(item.id)} />
                  </Space>
                </div>
              </div>
            </List.Item>
          )}
        />
      </Space>
    </Space>
  );
};

export default Landing;
