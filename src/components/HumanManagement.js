import React, { useState, useEffect, useMemo } from 'react';
import {
  Layout,
  Breadcrumb,
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  notification,
  Popconfirm,
  InputNumber,
  DatePicker,
  Space,
  Row,
  Col,
  Card,
  Statistic,
  Avatar,
  Upload,
  message,
  Tooltip,
  Typography,
} from 'antd';
import {
  SearchOutlined,
  DownloadOutlined,
  UploadOutlined,
  UserOutlined,
  DollarOutlined,
  TeamOutlined,
  PlusOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import * as XLSX from 'xlsx';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts'; // Add this line to import echarts

const { Option } = Select;
const { RangePicker } = DatePicker;
const { Header, Content, Footer } = Layout;
const { Title } = Typography;

const HumanManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [departments, setDepartments] = useState([
    'HR',
    'IT',
    'Finance',
    'Marketing',
  ]);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState('');
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [salaryData, setSalaryData] = useState({});
  const [isLeaveModalVisible, setIsLeaveModalVisible] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState(null);
  const [leaveForm] = Form.useForm();
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [performanceData, setPerformanceData] = useState({});
  const [leaveData, setLeaveData] = useState({});

  const dummyEmployees = useMemo(
    () => [
      {
        key: 0,
        name: 'John Doe',
        position: 'Software Engineer',
        department: 'IT',
        email: 'john.doe@example.com',
        salary: 85000,
        performanceRating: 'Excellent',
        leaveBalance: 15,
        avatar: '', // URL or base64 string for avatar
      },
      {
        key: 1,
        name: 'Jane Smith',
        position: 'Marketing Manager',
        department: 'Marketing',
        email: 'jane.smith@example.com',
        salary: 78000,
        performanceRating: 'Good',
        leaveBalance: 18,
        avatar: '',
      },
      {
        key: 2,
        name: 'Bob Johnson',
        position: 'Financial Analyst',
        department: 'Finance',
        email: 'bob.johnson@example.com',
        salary: 72000,
        performanceRating: 'Average',
        leaveBalance: 20,
        avatar: '',
      },
      {
        key: 3,
        name: 'Alice Brown',
        position: 'HR Specialist',
        department: 'HR',
        email: 'alice.brown@example.com',
        salary: 65000,
        performanceRating: 'Good',
        leaveBalance: 22,
        avatar: '',
      },
      {
        key: 4,
        name: 'Charlie Wilson',
        position: 'Product Manager',
        department: 'IT',
        email: 'charlie.wilson@example.com',
        salary: 95000,
        performanceRating: 'Excellent',
        leaveBalance: 12,
        avatar: '',
      },
    ],
    []
  );

  useEffect(() => {
    if (employees.length === 0) {
      setEmployees(dummyEmployees);
    }
  }, [employees, dummyEmployees]);

  useEffect(() => {
    // Filter employees based on search text and selected department
    const filtered = employees.filter((employee) => {
      const matchesSearchText =
        employee.name.toLowerCase().includes(searchText.toLowerCase()) ||
        employee.position.toLowerCase().includes(searchText.toLowerCase()) ||
        employee.department.toLowerCase().includes(searchText.toLowerCase()) ||
        employee.email.toLowerCase().includes(searchText.toLowerCase());

      const matchesDepartment =
        selectedDepartment === 'All' || employee.department === selectedDepartment;

      return matchesSearchText && matchesDepartment;
    });
    setFilteredEmployees(filtered);
  }, [employees, searchText, selectedDepartment]);

  useEffect(() => {
    // Update salary data for chart
    const departmentSalaries = {};
    employees.forEach((employee) => {
      if (departmentSalaries[employee.department]) {
        departmentSalaries[employee.department] += employee.salary;
      } else {
        departmentSalaries[employee.department] = employee.salary;
      }
    });

    setSalaryData({
      xAxis: {
        type: 'category',
        data: Object.keys(departmentSalaries),
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          data: Object.values(departmentSalaries),
          type: 'bar',
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#83bff6' },
              { offset: 0.5, color: '#188df0' },
              { offset: 1, color: '#188df0' },
            ]),
          },
        },
      ],
    });
  }, [employees]);

  useEffect(() => {
    // Update performance data for chart
    const performanceRatings = {};
    employees.forEach((employee) => {
      if (performanceRatings[employee.performanceRating]) {
        performanceRatings[employee.performanceRating] += 1;
      } else {
        performanceRatings[employee.performanceRating] = 1;
      }
    });

    setPerformanceData({
      tooltip: {
        trigger: 'item',
      },
      legend: {
        top: '5%',
        left: 'center',
      },
      series: [
        {
          name: 'Performance Rating',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2,
          },
          label: {
            show: false,
            position: 'center',
          },
          emphasis: {
            label: {
              show: true,
              fontSize: '40',
              fontWeight: 'bold',
            },
          },
          labelLine: {
            show: false,
          },
          data: Object.entries(performanceRatings).map(([name, value]) => ({ name, value })),
        },
      ],
    });
  }, [employees]);

  useEffect(() => {
    // Update leave balance data for chart
    const leaveBalances = {};
    employees.forEach((employee) => {
      leaveBalances[employee.name] = employee.leaveBalance;
    });

    setLeaveData({
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      xAxis: {
        type: 'category',
        data: Object.keys(leaveBalances),
        axisLabel: {
          interval: 0,
          rotate: 45,
        },
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          name: 'Leave Balance',
          data: Object.values(leaveBalances),
          type: 'bar',
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#ffa39e' },
              { offset: 1, color: '#ff4d4f' },
            ]),
          },
        },
      ],
    });
  }, [employees]);

  const openNotification = (type, messageText, description) => {
    notification[type]({
      message: messageText,
      description,
      placement: 'topRight',
    });
  };

  const columns = [
    {
      title: 'Avatar',
      dataIndex: 'avatar',
      key: 'avatar',
      render: (avatar) =>
        avatar ? (
          <Avatar src={avatar} size="large" />
        ) : (
          <Avatar size="large" icon={<UserOutlined />} />
        ),
      width: 80,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (text) => <strong>{text}</strong>,
      width: 150,
    },
    {
      title: 'Position',
      dataIndex: 'position',
      key: 'position',
      sorter: (a, b) => a.position.localeCompare(b.position),
      width: 150,
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
      filters: departments.map((dep) => ({ text: dep, value: dep })),
      onFilter: (value, record) => record.department === value,
      width: 120,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (email) => (
        <a href={`mailto:${email}`} style={{ color: '#1890ff' }}>
          {email}
        </a>
      ),
      width: 200,
    },
    {
      title: 'Salary',
      dataIndex: 'salary',
      key: 'salary',
      sorter: (a, b) => a.salary - b.salary,
      render: (salary) => `$${salary.toLocaleString()}`,
      width: 120,
    },
    {
      title: 'Performance',
      dataIndex: 'performanceRating',
      key: 'performanceRating',
      filters: [
        { text: 'Excellent', value: 'Excellent' },
        { text: 'Good', value: 'Good' },
        { text: 'Average', value: 'Average' },
        { text: 'Poor', value: 'Poor' },
      ],
      onFilter: (value, record) => record.performanceRating === value,
      render: (rating) => {
        let color = 'green';
        if (rating === 'Good') color = 'blue';
        if (rating === 'Average') color = 'orange';
        if (rating === 'Poor') color = 'red';
        return <span style={{ color, fontWeight: 500 }}>{rating}</span>;
      },
      width: 150,
    },
    {
      title: 'Leave Balance',
      dataIndex: 'leaveBalance',
      key: 'leaveBalance',
      sorter: (a, b) => a.leaveBalance - b.leaveBalance,
      render: (balance) => <span>{balance} days</span>,
      width: 130,
    },
    {
      title: 'Actions',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="View Details">
            <Button
              type="link"
              onClick={() => onView(record)}
              icon={<UserOutlined />}
            />
          </Tooltip>
          <Tooltip title="Edit Employee">
            <Button
              type="link"
              onClick={() => onEdit(record)}
              icon={<PlusOutlined />}
            />
          </Tooltip>
          <Tooltip title="Delete Employee">
            <Popconfirm
              title="Are you sure to delete this employee?"
              onConfirm={() => onDelete(record.key)}
              okText="Yes"
              cancelText="No"
            >
              <Button type="link" danger icon={<DeleteOutlined />} />
            </Popconfirm>
          </Tooltip>
          <Tooltip title="Manage Leave">
            <Button
              type="link"
              onClick={() => showLeaveModal(record)}
              icon={<DollarOutlined />}
            />
          </Tooltip>
        </Space>
      ),
      width: 150,
    },
  ];

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setIsEditing(false);
    setEditingEmployee(null);
    form.resetFields();
  };

  const onFinish = (values) => {
    const avatarFile = values.avatar?.fileList?.[0];
    const avatarURL = avatarFile
      ? URL.createObjectURL(avatarFile.originFileObj)
      : '';

    if (isEditing) {
      const updatedEmployees = employees.map((emp) =>
        emp.key === editingEmployee.key
          ? { ...emp, ...values, avatar: avatarURL }
          : emp
      );
      setEmployees(updatedEmployees);
      openNotification('success', 'Success', 'Employee updated successfully');
    } else {
      const newEmployee = {
        ...values,
        key: employees.length ? employees[employees.length - 1].key + 1 : 0,
        leaveBalance: 20,
        avatar: avatarURL,
      };
      setEmployees([...employees, newEmployee]);
      openNotification('success', 'Success', 'Employee added successfully');
    }
    handleCancel();
  };

  const onEdit = (record) => {
    setIsEditing(true);
    setEditingEmployee(record);
    form.setFieldsValue({
      ...record,
      avatar: [],
    });
    setIsModalVisible(true);
  };

  const onView = (record) => {
    Modal.info({
      title: 'Employee Details',
      content: (
        <Row gutter={[16, 16]}>
          <Col span={8} style={{ textAlign: 'center' }}>
            <Avatar
              size={100}
              src={record.avatar}
              icon={!record.avatar && <UserOutlined />}
            />
          </Col>
          <Col span={16}>
            <p>
              <strong>Name:</strong> {record.name}
            </p>
            <p>
              <strong>Position:</strong> {record.position}
            </p>
            <p>
              <strong>Department:</strong> {record.department}
            </p>
            <p>
              <strong>Email:</strong>{' '}
              <a href={`mailto:${record.email}`}>{record.email}</a>
            </p>
            <p>
              <strong>Salary:</strong> ${record.salary.toLocaleString()}
            </p>
            <p>
              <strong>Performance Rating:</strong> {record.performanceRating}
            </p>
            <p>
              <strong>Leave Balance:</strong> {record.leaveBalance} days
            </p>
          </Col>
        </Row>
      ),
      onOk() {},
      width: 600,
    });
  };

  const onDelete = (key) => {
    const filteredEmployees = employees.filter((employee) => employee.key !== key);
    setEmployees(filteredEmployees);
    openNotification('success', 'Success', 'Employee deleted successfully');
  };

  const addDepartment = (value) => {
    if (value && !departments.includes(value)) {
      setDepartments([...departments, value]);
      message.success(`Department "${value}" added`);
    }
  };

  const showLeaveModal = (employee) => {
    setCurrentEmployee(employee);
    setIsLeaveModalVisible(true);
  };

  const handleLeaveCancel = () => {
    setIsLeaveModalVisible(false);
    setCurrentEmployee(null);
    leaveForm.resetFields();
  };

  const onLeaveFinish = (values) => {
    const { leaveType, leaveDates } = values;
    const [startDate, endDate] = leaveDates;
    const daysDiff = endDate.diff(startDate, 'days') + 1;

    if (daysDiff > currentEmployee.leaveBalance) {
      openNotification(
        'error',
        'Error',
        'Insufficient leave balance for the requested period'
      );
      return;
    }

    const updatedEmployees = employees.map((emp) =>
      emp.key === currentEmployee.key
        ? { ...emp, leaveBalance: emp.leaveBalance - daysDiff }
        : emp
    );

    setEmployees(updatedEmployees);
    setIsLeaveModalVisible(false);
    leaveForm.resetFields();
    openNotification(
      'success',
      'Success',
      `Leave request for ${daysDiff} days has been processed`
    );
  };

  const exportToExcel = () => {
    const dataToExport = employees.map((emp) => ({
      Name: emp.name,
      Position: emp.position,
      Department: emp.department,
      Email: emp.email,
      Salary: emp.salary,
      'Performance Rating': emp.performanceRating,
      'Leave Balance': emp.leaveBalance,
    }));
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Employees');
    XLSX.writeFile(workbook, 'employees.xlsx');
    openNotification('success', 'Success', 'Employees exported to Excel successfully');
  };

  const handleDepartmentChange = (value) => {
    setSelectedDepartment(value);
  };

  const handleUploadModalCancel = () => {
    setUploadModalVisible(false);
  };

  const handleUpload = (file) => {
    const reader = new FileReader();
    reader.onload = (evt) => {
      /* Parse data */
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      /* Get first worksheet */
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      /* Convert array of arrays */
      const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
      // Process data and update employees
      const keys = data[0];
      const values = data.slice(1);
      const newEmployees = values.map((row, index) => {
        const employee = {};
        keys.forEach((key, idx) => {
          employee[key] = row[idx];
        });
        employee.key = employees.length + index;
        employee.leaveBalance = employee.leaveBalance || 20;
        employee.avatar = ''; // Reset avatar
        return employee;
      });
      setEmployees([...employees, ...newEmployees]);
      openNotification('success', 'Success', 'Employees uploaded successfully');
    };
    reader.readAsBinaryString(file);
    return false; // Prevent default upload behavior
  };

  const totalEmployees = employees.length;
  const totalSalaryCost = employees.reduce((acc, curr) => acc + curr.salary, 0);
  const averageSalary = totalEmployees
    ? (totalSalaryCost / totalEmployees).toFixed(2)
    : 0;
  const averageLeaveBalance = totalEmployees
    ? (
        employees.reduce((acc, curr) => acc + curr.leaveBalance, 0) /
        totalEmployees
      ).toFixed(2)
    : 0;

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Layout className="site-layout">
        <Header
          style={{
            padding: '0 24px',
            background: '#fff',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
          }}
        >
          <Title level={2} style={{ margin: 0, color: '#000' }}>
            Human Management System
          </Title>
        </Header>
        <Content style={{ margin: '16px', overflow: 'initial' }}>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: '#fff',
              borderRadius: '8px',
              boxShadow: '0 2px 8px #f0f1f2',
            }}
          >
            {/* Statistics Cards */}
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} lg={6}>
                <Card bordered={false}>
                  <Statistic
                    title="Total Employees"
                    value={totalEmployees}
                    prefix={<TeamOutlined />}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Card bordered={false}>
                  <Statistic
                    title="Total Salary Cost"
                    value={`$${totalSalaryCost.toLocaleString()}`}
                    prefix={<DollarOutlined />}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Card bordered={false}>
                  <Statistic
                    title="Average Salary"
                    value={`$${parseFloat(averageSalary).toLocaleString()}`}
                    prefix={<DollarOutlined />}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Card bordered={false}>
                  <Statistic
                    title="Average Leave Balance"
                    value={averageLeaveBalance}
                    suffix="days"
                  />
                </Card>
              </Col>
            </Row>

            {/* Search and Actions */}
            <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
              <Col xs={24} sm={24} md={8}>
                <Input
                  placeholder="Search employees"
                  prefix={<SearchOutlined />}
                  allowClear
                  onChange={(e) => setSearchText(e.target.value)}
                />
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Select
                  placeholder="Filter by Department"
                  onChange={handleDepartmentChange}
                  style={{ width: '100%' }}
                  value={selectedDepartment}
                  allowClear
                >
                  <Option value="All">All Departments</Option>
                  {departments.map((dep) => (
                    <Option key={dep} value={dep}>
                      {dep}
                    </Option>
                  ))}
                </Select>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Space>
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={showModal}
                  >
                    Add Employee
                  </Button>
                  <Button
                    icon={<DownloadOutlined />}
                    onClick={exportToExcel}
                  >
                    Export
                  </Button>
                  <Button
                    icon={<UploadOutlined />}
                    onClick={() => setUploadModalVisible(true)}
                  >
                    Import
                  </Button>
                </Space>
              </Col>
            </Row>

            {/* Employees Table */}
            <Table
              columns={columns}
              dataSource={filteredEmployees}
              style={{ marginTop: 24 }}
              pagination={{ pageSize: 5 }}
              scroll={{ x: 1500 }}
              rowSelection={{
                onChange: (selectedRowKeys, selectedRows) => {
                  // Implement bulk actions if needed
                },
              }}
              bordered
              components={{
                header: {
                  cell: (props) => (
                    <th
                      {...props}
                      style={{
                        ...props.style,
                        background: '#fafafa',
                      }}
                    />
                  ),
                },
              }}
            />

            {/* Add/Edit Employee Modal */}
            <Modal
              title={isEditing ? 'Edit Employee' : 'Add Employee'}
              visible={isModalVisible}
              onCancel={handleCancel}
              footer={null}
              destroyOnClose
              centered
              width={600}
            >
              <Form
                form={form}
                onFinish={onFinish}
                layout="vertical"
                initialValues={{
                  department: departments[0],
                }}
              >
                <Form.Item
                  name="avatar"
                  label="Avatar"
                  valuePropName="fileList"
                  getValueFromEvent={(e) => e && e.fileList}
                >
                  <Upload
                    listType="picture-card"
                    beforeUpload={() => false}
                    maxCount={1}
                    accept="image/*"
                  >
                    {form.getFieldValue('avatar') &&
                    form.getFieldValue('avatar').length >= 1 ? null : (
                      <div>
                        <PlusOutlined />
                        <div style={{ marginTop: 8 }}>Upload</div>
                      </div>
                    )}
                  </Upload>
                </Form.Item>
                <Form.Item
                  name="name"
                  label="Name"
                  rules={[
                    { required: true, message: 'Please input the name!' },
                    {
                      pattern: /^[A-Za-z\s]+$/,
                      message: 'Name should only contain letters and spaces',
                    },
                  ]}
                >
                  <Input placeholder="John Doe" />
                </Form.Item>
                <Form.Item
                  name="position"
                  label="Position"
                  rules={[
                    { required: true, message: 'Please input the position!' },
                  ]}
                >
                  <Input placeholder="Software Engineer" />
                </Form.Item>
                <Form.Item
                  name="department"
                  label="Department"
                  rules={[
                    { required: true, message: 'Please select the department!' },
                  ]}
                >
                  <Select
                    placeholder="Select or add department"
                    dropdownRender={(menu) => (
                      <>
                        {menu}
                        <Space style={{ padding: '8px' }}>
                          <Input
                            style={{ flex: 'auto' }}
                            placeholder="Add department"
                            onPressEnter={(e) => {
                              addDepartment(e.target.value);
                              form.setFieldsValue({ department: e.target.value });
                            }}
                          />
                          <Button
                            type="text"
                            icon={<PlusOutlined />}
                            onClick={() => {
                              const input = document.querySelector(
                                '.ant-select-dropdown input'
                              );
                              if (input && input.value) {
                                addDepartment(input.value);
                                form.setFieldsValue({ department: input.value });
                              }
                            }}
                          />
                        </Space>
                      </>
                    )}
                  >
                    {departments.map((dep) => (
                      <Option key={dep} value={dep}>
                        {dep}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item
                  name="email"
                  label="Email"
                  rules={[
                    { required: true, message: 'Please input the email!' },
                    {
                      type: 'email',
                      message: 'Please enter a valid email!',
                    },
                  ]}
                >
                  <Input placeholder="john.doe@example.com" />
                </Form.Item>
                <Form.Item
                  name="salary"
                  label="Salary"
                  rules={[
                    { required: true, message: 'Please input the salary!' },
                  ]}
                >
                  <InputNumber
                    formatter={(value) =>
                      `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                    }
                    parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                    style={{ width: '100%' }}
                    min={0}
                  />
                </Form.Item>
                <Form.Item
                  name="performanceRating"
                  label="Performance Rating"
                  rules={[
                    {
                      required: true,
                      message: 'Please select the performance rating!',
                    },
                  ]}
                >
                  <Select placeholder="Select performance rating">
                    <Option value="Excellent">Excellent</Option>
                    <Option value="Good">Good</Option>
                    <Option value="Average">Average</Option>
                    <Option value="Poor">Poor</Option>
                  </Select>
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit" block>
                    {isEditing ? 'Update Employee' : 'Add Employee'}
                  </Button>
                </Form.Item>
              </Form>
            </Modal>

            {/* Manage Leave Modal */}
            <Modal
              title="Manage Leave"
              visible={isLeaveModalVisible}
              onCancel={handleLeaveCancel}
              footer={null}
              destroyOnClose
              centered
              width={500}
            >
              <Form
                form={leaveForm}
                onFinish={onLeaveFinish}
                layout="vertical"
              >
                <Form.Item
                  name="leaveType"
                  label="Leave Type"
                  rules={[
                    {
                      required: true,
                      message: 'Please select the leave type!',
                    },
                  ]}
                >
                  <Select placeholder="Select leave type">
                    <Option value="Annual">Annual Leave</Option>
                    <Option value="Sick">Sick Leave</Option>
                    <Option value="Personal">Personal Leave</Option>
                  </Select>
                </Form.Item>
                <Form.Item
                  name="leaveDates"
                  label="Leave Dates"
                  rules={[
                    {
                      required: true,
                      message: 'Please select the leave dates!',
                    },
                  ]}
                >
                  <RangePicker style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit" block>
                    Submit Leave Request
                  </Button>
                </Form.Item>
              </Form>
            </Modal>

            {/* Upload Employees Modal */}
            <Modal
              title="Upload Employees from Excel"
              visible={uploadModalVisible}
              onCancel={handleUploadModalCancel}
              footer={null}
              centered
              width={500}
            >
              <Upload
                beforeUpload={handleUpload}
                accept=".xlsx, .xls"
                showUploadList={false}
              >
                <Button icon={<UploadOutlined />}>
                  Click to Upload Excel File
                </Button>
              </Upload>
            </Modal>

            {/* Charts Section */}
            <div style={{ marginTop: 32 }}>
              <Row gutter={[16, 16]}>
                <Col xs={24} lg={12}>
                  <Card title="Salary Distribution by Department" bordered={false}>
                    <ReactECharts
                      option={salaryData}
                      style={{ height: '400px' }}
                    />
                  </Card>
                </Col>
                <Col xs={24} lg={12}>
                  <Card title="Performance Rating Distribution" bordered={false}>
                    <ReactECharts
                      option={performanceData}
                      style={{ height: '400px' }}
                    />
                  </Card>
                </Col>
              </Row>
              <Row gutter={[16, 16]} style={{ marginTop: 32 }}>
                <Col xs={24}>
                  <Card title="Leave Balance by Employee" bordered={false}>
                    <ReactECharts
                      option={leaveData}
                      style={{ height: '400px' }}
                    />
                  </Card>
                </Col>
              </Row>
            </div>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default HumanManagement;