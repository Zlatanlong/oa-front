/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from 'react';
import { Divider, Card, Table, Button, Popconfirm, message, Modal } from 'antd';
import { userColomns } from '../../utils/table-columns';
import http from '../../utils/axios';
import UserSearchResult from '../../components/UserSearchResult';

const TeamInfo = props => {
  const pageCurrent = useRef(1);
  const pageSize = useRef(10);
  const [teamData, setTeamData] = useState({ membersPage: { total: 0 } });
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [addUserIDs, setAddUserIDs] = useState([]);

  useEffect(() => {
    getPageData();
  }, []);

  const getPageData = () => {
    http
      .post('/team', {
        pageCurrent: pageCurrent.current,
        pageSize: pageSize.current,
        data: {
          id: props.match.params.id
        }
      })
      .then(res => {
        if (res.data.code === 0) {
          setTeamData(res.data.data);
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  const handleDelMembers = () => {
    let members = selectedRowKeys.map(key => ({ id: key }));
    http
      .post('/team/delMember', {
        teamId: props.match.params.id,
        members
      })
      .then(res => {
        if (res.data.code === 0) {
          message.success('已删除！');
          getPageData();
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  const handleAddMembers = () => {
    let members = addUserIDs.map(id => ({ id }));
    http
      .post('/team/addMember', {
        teamId: props.match.params.id,
        members
      })
      .then(res => {
        if (res.data.code === 0) {
          message.success('添加成功！');
          setSelectedRowKeys([]);
          getPageData();
        }
      })
      .catch(err => {
        console.log(err);
      });

    setShowModal(false);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRowKeys(selectedRowKeys);
    }
  };

  const pagination = {
    total: teamData.membersPage.total,
    showTotal: (total, range) =>
      ` 共 ${total} 条，第 ${range[0]}-${range[1]} 条`,
    onChange: (page, pageSize) => {
      pageCurrent.current = page;
      getPageData();
    },
    onShowSizeChange: (current, size) => {
      pageCurrent.current = 1;
      pageSize.current = size;
      getPageData();
    }
  };

  return (
    <div>
      <Card title={`${teamData.teamName}成员：`}>
        <Button
          onClick={() => {
            setShowModal(true);
          }}
          type='primary'>
          添加成员
        </Button>
        <Popconfirm
          title='谨慎：确定删除？'
          onConfirm={() => {
            handleDelMembers();
          }}>
          <Button
            style={{ float: 'right' }}
            disabled={selectedRowKeys.length === 0}
            danger={selectedRowKeys.length > 0}
            size='small'>{`删除已选择的${selectedRowKeys.length}项`}</Button>
        </Popconfirm>
        <Button
          style={{ float: 'right' }}
          disabled={selectedRowKeys.length === 0}
          type='link'
          size='small'
          onClick={() => {
            setSelectedRowKeys([]);
          }}>
          清除已选
        </Button>
        <Divider />
        <Table
          columns={userColomns}
          dataSource={teamData.membersPage.records}
          pagination={pagination}
          rowKey={record => record.id}
          rowSelection={rowSelection}
        />
      </Card>
      <Modal
        visible={showModal}
        width='80%'
        title='添加成员'
        onCancel={() => {
          setShowModal(false);
        }}
        onOk={handleAddMembers}>
        <UserSearchResult
          getSelectIDs={ids => {
            setAddUserIDs(ids);
          }}
        />
      </Modal>
    </div>
  );
};

export default TeamInfo;
