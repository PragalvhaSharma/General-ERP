import React, { useState, useEffect, useMemo } from 'react';
import {
  Layout,
  List,
  Card,
  Avatar,
  Input,
  Button,
  Modal,
  Form,
  Select,
  message,
  Tabs,
  Timeline,
  Tag,
  Space,
  Empty,
  Pagination,
  Row,
  Col,
  Descriptions,
  Tooltip,
  Badge,
  Dropdown,
  Menu,
  Checkbox,
  Statistic,
  Row as AntRow,
  Col as AntCol,
  Typography,
  DatePicker,
  Breadcrumb,
  Table,
  notification,
  Popconfirm,
  InputNumber,
  Upload,
} from 'antd';
import {
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  PlusOutlined,
  SearchOutlined,
  InfoCircleOutlined,
  EditOutlined,
  DeleteOutlined,
  DownOutlined,
  FilterOutlined,
} from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import 'antd/dist/reset.css';
import debounce from 'lodash/debounce'; // For debounced search

const { Content, Header } = Layout;
const { TabPane } = Tabs;
const { Option } = Select;
const { Title } = Typography;
const { RangePicker } = DatePicker;

// Simulated data - replace with actual API calls in a real application
const initialCustomers = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    phone: '123-456-7890',
    status: 'Active',
    industry: 'Technology',
  },
  {
    id: 4,
    name: 'Siddharth Duggal',
    email: 'siddharth@example.com',
    phone: '098-765-4321',
    status: 'Active',
    industry: 'Healthcare',
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '098-765-4321',
    status: 'Inactive',
    industry: 'Healthcare',
  },
  {
    id: 3,
    name: 'Jenny Doe',
    email: 'jenny@example.com',
    phone: '098-765-4321',
    status: 'Inactive',
    industry: 'Healthcare',
  },
  // Add more customers as needed
];

const initialInteractions = [
  {
    id: 1,
    customerId: 1,
    type: 'Call',
    date: '2024-04-15',
    notes: 'Discussed new product features',
  },
  {
    id: 2,
    customerId: 1,
    type: 'Email',
    date: '2024-04-10',
    notes: 'Sent follow-up on pricing',
  },
  // Add interactions for Siddharth Duggal (customerId: 4)
  {
    id: 3,
    customerId: 4,
    type: 'Meeting',
    date: '2024-04-20',
    notes: 'Initial consultation to discuss healthcare software needs',
  },
  {
    id: 4,
    customerId: 4,
    type: 'Email',
    date: '2024-04-22',
    notes: 'Sent proposal for custom healthcare management system',
  },
  {
    id: 5,
    customerId: 4,
    type: 'Call',
    date: '2024-04-25',
    notes: 'Followed up on proposal, answered questions about implementation timeline',
  },
  {
    id: 6,
    customerId: 4,
    type: 'Meeting',
    date: '2024-05-02',
    notes: 'Presented demo of healthcare management system, client very interested',
  },
  {
    id: 7,
    customerId: 4,
    type: 'Email',
    date: '2024-05-05',
    notes: 'Sent revised quote based on additional features requested during demo',
  },
  // Add more interactions as needed
];

const CRM = () => {
  const [customers, setCustomers] = useState(initialCustomers);
  const [interactions, setInteractions] = useState(initialInteractions);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalType, setModalType] = useState('');
  const [form] = Form.useForm();
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: null,
    industry: null,
  });
  const [sorter, setSorter] = useState({
    field: null,
    order: null,
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  // Bulk selection state
  const [selectedCustomerIds, setSelectedCustomerIds] = useState([]);

  // New state for date range and customer notes
  const [dateRange, setDateRange] = useState([null, null]);
  const [customerNotes, setCustomerNotes] = useState({});

  useEffect(() => {
    // Simulated API call to fetch customers and interactions
    // Replace with actual API calls in a real application
    setCustomers(initialCustomers);
    setInteractions(initialInteractions);
  }, []);

  const showModal = (type, record = null) => {
    setModalType(type);
    setIsModalVisible(true);
    if (type === 'editCustomer' && record) {
      form.setFieldsValue(record);
    } else if (type === 'editInteraction' && record) {
      form.setFieldsValue(record);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setModalType('');
    form.resetFields();
  };

  const handleSubmit = (values) => {
    if (modalType === 'customer' || modalType === 'editCustomer') {
      if (modalType === 'customer') {
        const newCustomer = {
          id: customers.length + 1,
          ...values,
        };
        setCustomers([...customers, newCustomer]);
        message.success('Customer added successfully');
      } else {
        // Edit customer
        const updatedCustomers = customers.map((customer) =>
          customer.id === values.id ? { ...customer, ...values } : customer
        );
        setCustomers(updatedCustomers);
        message.success('Customer updated successfully');
        if (selectedCustomer && selectedCustomer.id === values.id) {
          setSelectedCustomer(values);
        }
      }
    } else if (modalType === 'interaction' || modalType === 'editInteraction') {
      if (modalType === 'interaction') {
        const newInteraction = {
          id: interactions.length + 1,
          customerId: selectedCustomer.id,
          ...values,
        };
        setInteractions([...interactions, newInteraction]);
        message.success('Interaction added successfully');
      } else {
        // Edit interaction
        const updatedInteractions = interactions.map((interaction) =>
          interaction.id === values.id ? { ...interaction, ...values } : interaction
        );
        setInteractions(updatedInteractions);
        message.success('Interaction updated successfully');
      }
    }
    setIsModalVisible(false);
    setModalType('');
    form.resetFields();
  };

  const handleDeleteCustomer = (id) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this customer?',
      onOk: () => {
        setCustomers(customers.filter((customer) => customer.id !== id));
        setInteractions(interactions.filter((interaction) => interaction.customerId !== id));
        message.success('Customer deleted successfully');
        if (selectedCustomer && selectedCustomer.id === id) {
          setSelectedCustomer(null);
        }
      },
    });
  };

  const handleDeleteInteraction = (id) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this interaction?',
      onOk: () => {
        setInteractions(interactions.filter((interaction) => interaction.id !== id));
        message.success('Interaction deleted successfully');
      },
    });
  };

  const handleBulkDelete = () => {
    if (selectedCustomerIds.length === 0) {
      message.warning('Please select at least one customer to delete');
      return;
    }
    Modal.confirm({
      title: `Are you sure you want to delete ${selectedCustomerIds.length} selected customer(s)?`,
      onOk: () => {
        setCustomers(customers.filter((customer) => !selectedCustomerIds.includes(customer.id)));
        setInteractions(
          interactions.filter((interaction) => !selectedCustomerIds.includes(interaction.customerId))
        );
        setSelectedCustomerIds([]);
        message.success('Selected customers deleted successfully');
        if (selectedCustomer && selectedCustomerIds.includes(selectedCustomer.id)) {
          setSelectedCustomer(null);
        }
      },
    });
  };

  const filteredCustomers = useMemo(() => {
    let data = customers.filter(
      (customer) =>
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.industry.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (filters.status) {
      data = data.filter((customer) => customer.status === filters.status);
    }

    if (filters.industry) {
      data = data.filter((customer) => customer.industry === filters.industry);
    }

    if (sorter.field && sorter.order) {
      data = data.sort((a, b) => {
        if (sorter.order === 'ascend') {
          return a[sorter.field].localeCompare(b[sorter.field]);
        } else {
          return b[sorter.field].localeCompare(a[sorter.field]);
        }
      });
    }

    return data;
  }, [customers, searchTerm, filters, sorter]);

  const customerInteractions = useMemo(() => {
    return interactions
      .filter((interaction) => interaction.customerId === selectedCustomer?.id)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [interactions, selectedCustomer]);

  // Data for charts
  const interactionData = useMemo(() => {
    // Example data structure for chart
    return [
      { date: '2024-01', Calls: 20, Emails: 30, Meetings: 10, TotalInteractions: 60 },
      { date: '2024-02', Calls: 25, Emails: 35, Meetings: 15, TotalInteractions: 75 },
      { date: '2024-03', Calls: 30, Emails: 40, Meetings: 20, TotalInteractions: 90 },
      { date: '2024-04', Calls: 35, Emails: 45, Meetings: 25, TotalInteractions: 105 },
      { date: '2024-05', Calls: 40, Emails: 50, Meetings: 30, TotalInteractions: 120 },
      // Add more data points as needed
    ];
  }, []);

  // Paginated customers
  const paginatedCustomers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredCustomers.slice(start, start + pageSize);
  }, [filteredCustomers, currentPage]);

  // Debounced search to optimize performance
  const debouncedSearch = useMemo(
    () =>
      debounce((value) => {
        setSearchTerm(value);
        setCurrentPage(1);
      }, 300),
    []
  );

  const handleSearchChange = (e) => {
    debouncedSearch(e.target.value);
  };

  const handleFilterChange = (value, key) => {
    setFilters({ ...filters, [key]: value });
    setCurrentPage(1);
  };

  const handleSort = (field, order) => {
    setSorter({ field, order });
  };

  // Statistics
  const totalCustomers = customers.length;
  const activeCustomers = customers.filter((customer) => customer.status === 'Active').length;
  const inactiveCustomers = customers.filter((customer) => customer.status === 'Inactive').length;

  // New function to handle date range change
  const handleDateRangeChange = (dates) => {
    setDateRange(dates);
  };

  // Modify the handleNotesChange function
  const handleNotesChange = (customerId, notes) => {
    setCustomerNotes(prevNotes => ({
      ...prevNotes,
      [customerId]: { text: notes, lastSaved: null }
    }));
  };

  // Add a new function to handle saving notes
  const handleSaveNotes = (customerId) => {
    setCustomerNotes(prevNotes => ({
      ...prevNotes,
      [customerId]: { 
        ...prevNotes[customerId],
        lastSaved: new Date().toLocaleString()
      }
    }));
    message.success('Notes saved successfully');
  };

  // ECharts option for the activity chart
  const getChartOption = () => ({
    title: {
      text: 'Customer Interaction Activity',
      left: 'center',
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985',
        },
      },
    },
    legend: {
      data: ['Calls', 'Emails', 'Meetings', 'Total Interactions'],
      top: 'bottom',
    },
    toolbox: {
      feature: {
        saveAsImage: {},
      },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '10%',
      containLabel: true,
    },
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        data: interactionData.map(item => item.date),
      },
    ],
    yAxis: [
      {
        type: 'value',
      },
    ],
    series: [
      {
        name: 'Calls',
        type: 'line',
        stack: 'Total',
        areaStyle: {},
        emphasis: {
          focus: 'series',
        },
        data: interactionData.map(item => item.Calls),
      },
      {
        name: 'Emails',
        type: 'line',
        stack: 'Total',
        areaStyle: {},
        emphasis: {
          focus: 'series',
        },
        data: interactionData.map(item => item.Emails),
      },
      {
        name: 'Meetings',
        type: 'line',
        stack: 'Total',
        areaStyle: {},
        emphasis: {
          focus: 'series',
        },
        data: interactionData.map(item => item.Meetings),
      },
      {
        name: 'Total Interactions',
        type: 'line',
        emphasis: {
          focus: 'series',
        },
        data: interactionData.map(item => item.TotalInteractions),
      },
    ],
  });

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
            Customer Relationship Management
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
            <Row gutter={[24, 24]}>
              {/* Customer List Section */}
              <Col xs={24} lg={8}>
                <Card
                  title="Customer List"
                  bordered={false}
                  hoverable
                  style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
                  extra={
                    <Button
                      type="primary"
                      icon={<PlusOutlined />}
                      onClick={() => showModal('customer')}
                    >
                      Add Customer
                    </Button>
                  }
                >
                  {/* Search and Filters */}
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <Input
                      placeholder="Search customers"
                      prefix={<SearchOutlined />}
                      onChange={handleSearchChange}
                      allowClear
                    />
                    <Space>
                      <Select
                        placeholder="Filter by Status"
                        allowClear
                        style={{ width: 150 }}
                        onChange={(value) => handleFilterChange(value, 'status')}
                        value={filters.status}
                      >
                        <Option value="Active">Active</Option>
                        <Option value="Inactive">Inactive</Option>
                      </Select>
                      <Select
                        placeholder="Filter by Industry"
                        allowClear
                        style={{ width: 180 }}
                        onChange={(value) => handleFilterChange(value, 'industry')}
                        value={filters.industry}
                      >
                        {Array.from(new Set(customers.map((c) => c.industry))).map((industry) => (
                          <Option key={industry} value={industry}>
                            {industry}
                          </Option>
                        ))}
                      </Select>
                      <Dropdown
                        overlay={
                          <Menu>
                            <Menu.Item key="nameAsc" onClick={() => handleSort('name', 'ascend')}>
                              Sort by Name (A-Z)
                            </Menu.Item>
                            <Menu.Item key="nameDesc" onClick={() => handleSort('name', 'descend')}>
                              Sort by Name (Z-A)
                            </Menu.Item>
                            <Menu.Item key="emailAsc" onClick={() => handleSort('email', 'ascend')}>
                              Sort by Email (A-Z)
                            </Menu.Item>
                            <Menu.Item key="emailDesc" onClick={() => handleSort('email', 'descend')}>
                              Sort by Email (Z-A)
                            </Menu.Item>
                            <Menu.Item key="industryAsc" onClick={() => handleSort('industry', 'ascend')}>
                              Sort by Industry (A-Z)
                            </Menu.Item>
                            <Menu.Item key="industryDesc" onClick={() => handleSort('industry', 'descend')}>
                              Sort by Industry (Z-A)
                            </Menu.Item>
                          </Menu>
                        }
                      >
                        <Button icon={<FilterOutlined />} >
                          Sort <DownOutlined />
                        </Button>
                      </Dropdown>
                    </Space>
                  </Space>

                  {/* Bulk Actions */}
                  <Space style={{ marginTop: '16px', marginBottom: '8px' }}>
                    {selectedCustomerIds.length > 0 && (
                      <Button
                        type="danger"
                        icon={<DeleteOutlined />}
                        onClick={handleBulkDelete}
                      >
                        Delete Selected
                      </Button>
                    )}
                  </Space>

                  {/* Customer List */}
                  <List
                    dataSource={paginatedCustomers}
                    locale={{ emptyText: 'No customers found' }}
                    renderItem={(customer) => (
                      <List.Item
                        key={customer.id}
                        style={{
                          cursor: 'pointer',
                          borderRadius: '4px',
                          marginBottom: '8px',
                          padding: '12px',
                          backgroundColor:
                            selectedCustomer?.id === customer.id ? '#e6f7ff' : '#fff',
                          transition: 'background-color 0.3s',
                        }}
                        onClick={() => setSelectedCustomer(customer)}
                      >
                        <Checkbox
                          checked={selectedCustomerIds.includes(customer.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedCustomerIds([...selectedCustomerIds, customer.id]);
                            } else {
                              setSelectedCustomerIds(
                                selectedCustomerIds.filter((id) => id !== customer.id)
                              );
                            }
                          }}
                          style={{ marginRight: '12px' }}
                          onClick={(e) => e.stopPropagation()}
                        />
                        <List.Item.Meta
                          avatar={
                            <Avatar
                              size="large"
                              icon={<UserOutlined />}
                              style={{ backgroundColor: '#1890ff' }}
                            />
                          }
                          title={
                            <Space>
                              <span style={{ fontWeight: '500' }}>{customer.name}</span>
                              {customer.status === 'Active' ? (
                                <Badge status="success" text="Active" />
                              ) : (
                                <Badge status="error" text="Inactive" />
                              )}
                            </Space>
                          }
                          description={
                            <>
                              <Space>
                                <MailOutlined style={{ color: '#555' }} />
                                <span>{customer.email}</span>
                              </Space>
                              <br />
                              <Space>
                                <PhoneOutlined style={{ color: '#555' }} />
                                <span>{customer.phone}</span>
                              </Space>
                              <br />
                              <Tag color="geekblue" style={{ marginTop: '8px' }}>
                                {customer.industry}
                              </Tag>
                            </>
                          }
                        />
                        {/* Action Buttons */}
                        <Space
                          style={{ marginLeft: 'auto' }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Tooltip title="Edit Customer">
                            <Button
                              type="link"
                              icon={<EditOutlined />}
                              onClick={() => showModal('editCustomer', customer)}
                            />
                          </Tooltip>
                          <Tooltip title="Delete Customer">
                            <Button
                              type="link"
                              icon={<DeleteOutlined />}
                              onClick={() => handleDeleteCustomer(customer.id)}
                            />
                          </Tooltip>
                        </Space>
                      </List.Item>
                    )}
                  />
                  <Pagination
                    current={currentPage}
                    pageSize={pageSize}
                    total={filteredCustomers.length}
                    onChange={(page) => setCurrentPage(page)}
                    style={{ marginTop: '16px', textAlign: 'right' }}
                    showSizeChanger={false}
                  />
                </Card>
              </Col>

              {/* Customer Details Section */}
              <Col xs={24} lg={16}>
                {selectedCustomer ? (
                  <Card
                    title={
                      <Space>
                        <Avatar
                          icon={<UserOutlined />}
                          style={{ backgroundColor: '#1890ff' }}
                        />
                        <span style={{ fontSize: '18px', fontWeight: '500' }}>
                          {selectedCustomer.name}'s Profile
                        </span>
                      </Space>
                    }
                    bordered={false}
                    hoverable
                    style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
                    extra={
                      <Space>
                        <Button
                          type="primary"
                          icon={<PlusOutlined />}
                          onClick={() => showModal('interaction')}
                        >
                          Add Interaction
                        </Button>
                        <Dropdown
                          overlay={
                            <Menu>
                              <Menu.Item key="edit" onClick={() => showModal('editCustomer', selectedCustomer)}>
                                Edit Customer
                              </Menu.Item>
                              <Menu.Item key="delete" onClick={() => handleDeleteCustomer(selectedCustomer.id)}>
                                Delete Customer
                              </Menu.Item>
                            </Menu>
                          }
                        >
                          <Button icon={<DownOutlined />}>Quick Actions</Button>
                        </Dropdown>
                      </Space>
                    }
                  >
                    {/* Customer Statistics */}
                    <AntRow gutter={16} style={{ marginBottom: '24px' }}>
                      <AntCol span={8}>
                        <Card>
                          <Statistic
                            title="Total Interactions"
                            value={customerInteractions.length}
                            prefix={<MailOutlined />}
                          />
                        </Card>
                      </AntCol>
                      <AntCol span={8}>
                        <Card>
                          <Statistic
                            title="Active Status"
                            value={selectedCustomer.status === 'Active' ? 1 : 0}
                            valueStyle={{ color: '#3f8600' }}
                            suffix={selectedCustomer.status === 'Active' ? 'Active' : 'Inactive'}
                          />
                        </Card>
                      </AntCol>
                      <AntCol span={8}>
                        <Card>
                          <Statistic
                            title="Industry"
                            value={selectedCustomer.industry}
                            prefix={<Tag color="geekblue" />}
                          />
                        </Card>
                      </AntCol>
                    </AntRow>

                    <Tabs defaultActiveKey="1" type="card">
                      {/* Details Tab */}
                      <TabPane tab="Details" key="1">
                        <Descriptions
                          bordered
                          column={1}
                          size="small"
                          layout="vertical"
                          style={{ backgroundColor: '#fafafa' }}
                        >
                          <Descriptions.Item label="Name">
                            <Space>
                              <UserOutlined />
                              {selectedCustomer.name}
                            </Space>
                          </Descriptions.Item>
                          <Descriptions.Item label="Email">
                            <Space>
                              <MailOutlined />
                              {selectedCustomer.email}
                            </Space>
                          </Descriptions.Item>
                          <Descriptions.Item label="Phone">
                            <Space>
                              <PhoneOutlined />
                              {selectedCustomer.phone}
                            </Space>
                          </Descriptions.Item>
                          <Descriptions.Item label="Status">
                            <Tag color={selectedCustomer.status === 'Active' ? 'green' : 'red'}>
                              {selectedCustomer.status}
                            </Tag>
                          </Descriptions.Item>
                          <Descriptions.Item label="Industry">
                            <Tag color="geekblue">{selectedCustomer.industry}</Tag>
                          </Descriptions.Item>
                        </Descriptions>
                      </TabPane>

                      {/* Interaction History Tab */}
                      <TabPane tab="Interaction History" key="2">
                        {customerInteractions.length > 0 ? (
                          <Timeline>
                            {customerInteractions.map((interaction) => (
                              <Timeline.Item key={interaction.id}>
                                <Space direction="vertical">
                                  <Space>
                                    <Tag color="blue">{interaction.type}</Tag>
                                    <span>{new Date(interaction.date).toLocaleDateString()}</span>
                                  </Space>
                                  <span>{interaction.notes}</span>
                                  <Space>
                                    <Tooltip title="Edit Interaction">
                                      <Button
                                        type="link"
                                        icon={<EditOutlined />}
                                        onClick={() => showModal('editInteraction', interaction)}
                                      />
                                    </Tooltip>
                                    <Tooltip title="Delete Interaction">
                                      <Button
                                        type="link"
                                        icon={<DeleteOutlined />}
                                        onClick={() => handleDeleteInteraction(interaction.id)}
                                      />
                                    </Tooltip>
                                  </Space>
                                </Space>
                              </Timeline.Item>
                            ))}
                          </Timeline>
                        ) : (
                          <Empty description="No interactions found" />
                        )}
                      </TabPane>

                      {/* Activity Chart Tab */}
                      <TabPane tab="Activity Chart" key="3">
                        <Space direction="vertical" style={{ width: '100%', marginBottom: '16px' }}>
                          <RangePicker onChange={handleDateRangeChange} />
                        </Space>
                        <ReactECharts
                          option={getChartOption()}
                          style={{ height: '400px', width: '100%' }}
                        />
                      </TabPane>

                      {/* Notes Tab */}
                      <TabPane tab="Notes" key="4">
                        <Form.Item>
                          <Input.TextArea
                            rows={4}
                            value={customerNotes[selectedCustomer.id]?.text || ''}
                            onChange={(e) => handleNotesChange(selectedCustomer.id, e.target.value)}
                            placeholder="Add notes about this customer..."
                          />
                        </Form.Item>
                        <Form.Item>
                          <Button 
                            type="primary" 
                            onClick={() => handleSaveNotes(selectedCustomer.id)}
                            disabled={!customerNotes[selectedCustomer.id]?.text}
                          >
                            Save Notes
                          </Button>
                        </Form.Item>
                        {customerNotes[selectedCustomer.id]?.lastSaved && (
                          <Typography.Text type="secondary">
                            Last saved: {customerNotes[selectedCustomer.id].lastSaved}
                          </Typography.Text>
                        )}
                      </TabPane>
                    </Tabs>
                  </Card>
                ) : (
                  <Card
                    bordered={false}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: '100%',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    }}
                  >
                    <Empty
                      description={
                        <span>
                          Select a customer to view details <InfoCircleOutlined />
                        </span>
                      }
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                    />
                  </Card>
                )}
              </Col>
            </Row>

            {/* Statistics Section */}
            <Row gutter={[24, 24]} style={{ marginTop: '24px' }}>
              <Col xs={24} lg={12}>
                <Card>
                  <Statistic
                    title="Total Customers"
                    value={totalCustomers}
                    prefix={<UserOutlined />}
                  />
                </Card>
              </Col>
              <Col xs={24} lg={12}>
                <Card>
                  <Statistic
                    title="Active Customers"
                    value={activeCustomers}
                    valueStyle={{ color: '#3f8600' }}
                    prefix={<Badge status="success" />}
                  />
                  <Statistic
                    title="Inactive Customers"
                    value={inactiveCustomers}
                    valueStyle={{ color: '#cf1322' }}
                    prefix={<Badge status="error" />}
                    style={{ marginTop: '16px' }}
                  />
                </Card>
              </Col>
            </Row>
          </div>
        </Content>
      </Layout>

      {/* Modal for Adding or Editing Customers or Interactions */}
      <Modal
        title={
          modalType === 'customer'
            ? 'Add New Customer'
            : modalType === 'editCustomer'
            ? 'Edit Customer'
            : modalType === 'interaction'
            ? 'Add New Interaction'
            : 'Edit Interaction'
        }
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        destroyOnClose
        centered
        width={modalType === 'customer' || modalType === 'editCustomer' ? 600 : 500}
      >
        <Form
          form={form}
          onFinish={handleSubmit}
          layout="vertical"
          initialValues={{
            status: 'Active',
            type: 'Call',
          }}
        >
          {modalType === 'customer' || modalType === 'editCustomer' ? (
            <>
              <Form.Item
                name="name"
                label="Name"
                rules={[{ required: true, message: 'Please enter the customer name' }]}
              >
                <Input placeholder="Enter customer name" />
              </Form.Item>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, type: 'email', message: 'Please enter a valid email' },
                ]}
              >
                <Input placeholder="Enter customer email" />
              </Form.Item>
              <Form.Item
                name="phone"
                label="Phone"
                rules={[
                  {
                    pattern: /^\d{3}-\d{3}-\d{4}$/,
                    message: 'Phone number must be in format 123-456-7890',
                  },
                ]}
              >
                <Input placeholder="123-456-7890" />
              </Form.Item>
              <Form.Item
                name="status"
                label="Status"
                rules={[{ required: true, message: 'Please select status' }]}
              >
                <Select placeholder="Select status">
                  <Option value="Active">Active</Option>
                  <Option value="Inactive">Inactive</Option>
                </Select>
              </Form.Item>
              <Form.Item
                name="industry"
                label="Industry"
                rules={[{ required: true, message: 'Please enter industry' }]}
              >
                <Input placeholder="Enter industry" />
              </Form.Item>
              {modalType === 'editCustomer' && (
                <Form.Item name="id" hidden>
                  <Input />
                </Form.Item>
              )}
            </>
          ) : (
            <>
              <Form.Item
                name="type"
                label="Interaction Type"
                rules={[{ required: true, message: 'Please select interaction type' }]}
              >
                <Select placeholder="Select interaction type">
                  <Option value="Call">Call</Option>
                  <Option value="Email">Email</Option>
                  <Option value="Meeting">Meeting</Option>
                </Select>
              </Form.Item>
              <Form.Item
                name="date"
                label="Date"
                rules={[{ required: true, message: 'Please select date' }]}
              >
                {/* Using DatePicker for better UX */}
                <Input type="date" />
                {/* Alternatively, you can use Ant Design's DatePicker:
                <DatePicker style={{ width: '100%' }} /> */}
              </Form.Item>
              <Form.Item
                name="notes"
                label="Notes"
                rules={[{ required: true, message: 'Please enter notes' }]}
              >
                <Input.TextArea rows={4} placeholder="Enter interaction notes" />
              </Form.Item>
              {modalType === 'editInteraction' && (
                <Form.Item name="id" hidden>
                  <Input />
                </Form.Item>
              )}
            </>
          )}
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
};

export default CRM;