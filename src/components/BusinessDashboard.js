import React, { useState, useEffect } from 'react';
import {
  Layout,
  Avatar,
  Badge,
  Input,
  Button,
  Row,
  Col,
  Card,
  Tabs,
  Statistic,
  Progress,
  Tag,
  Timeline,
  Calendar,
  Modal,
  Typography,
  ConfigProvider,
  notification,
  List,
  Select,
  message,
} from 'antd';
import {
  BellOutlined,
  SearchOutlined,
  DollarOutlined,
  ProjectOutlined,
  CheckCircleOutlined,
  RiseOutlined,
  CalendarOutlined,
  TeamOutlined,
  ClockCircleOutlined,
  ScheduleOutlined,
} from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import styled from 'styled-components';
import 'antd/dist/reset.css';
import moment from 'moment';
import 'moment/locale/en-gb';

const { Header, Content } = Layout;
const { Title, Text } = Typography;

const BusinessDashboard = () => {
  const [revenue, setRevenue] = useState(1000000);
  const [activeProjects, setActiveProjects] = useState(15);
  const [completedProjects, setCompletedProjects] = useState(78);
  const [teamPerformance, setTeamPerformance] = useState(87);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [calendarModalVisible, setCalendarModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventDetailsModalVisible, setEventDetailsModalVisible] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [projectModalVisible, setProjectModalVisible] = useState(false);
  const [employeeModalVisible, setEmployeeModalVisible] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'New Project Assigned',
      description: 'You have been assigned to Project Alpha.',
    },
    {
      id: 2,
      title: 'Meeting Reminder',
      description: 'Team meeting at 3 PM today.',
    },
  ]);

  const departments = [
    'Sales',
    'Marketing',
    'Engineering',
    'Human Resources',
    'Finance',
    'Customer Support',
  ];

  const employees = [
    { id: 1, name: 'John Doe', department: 'Sales', performance: 92, projects: 5 },
    { id: 2, name: 'Jane Smith', department: 'Marketing', performance: 88, projects: 4 },
    { id: 3, name: 'Alice Johnson', department: 'Engineering', performance: 95, projects: 6 },
    { id: 4, name: 'Bob Brown', department: 'Human Resources', performance: 87, projects: 3 },
    { id: 5, name: 'Emma Wilson', department: 'Finance', performance: 91, projects: 4 },
    { id: 6, name: 'Michael Chen', department: 'Customer Support', performance: 89, projects: 5 },
    { id: 7, name: 'Sarah Lee', department: 'Engineering', performance: 93, projects: 5 },
    { id: 8, name: 'David Garcia', department: 'Sales', performance: 86, projects: 4 },
  ];

  const projects = [
    {
      id: 1,
      name: 'Product Launch',
      department: 'Marketing',
      status: 'In Progress',
      progress: 75,
      description: 'Launching the new product line.',
      team: ['Jane Smith', 'John Doe'],
    },
    {
      id: 2,
      name: 'Customer Portal Upgrade',
      department: 'Engineering',
      status: 'Planned',
      progress: 0,
      description: 'Upgrading the customer portal for better UX.',
      team: ['Alice Johnson', 'Sarah Lee'],
    },
    {
      id: 3,
      name: 'Q3 Financial Report',
      department: 'Finance',
      status: 'Completed',
      progress: 100,
      description: 'Completed Q3 financial analysis.',
      team: ['Emma Wilson'],
    },
    {
      id: 4,
      name: 'Employee Training Program',
      department: 'Human Resources',
      status: 'In Progress',
      progress: 60,
      description: 'Organizing training sessions for employees.',
      team: ['Bob Brown'],
    },
    {
      id: 5,
      name: 'Sales Automation Tool',
      department: 'Sales',
      status: 'In Progress',
      progress: 40,
      description: 'Developing an automation tool for sales.',
      team: ['John Doe', 'David Garcia'],
    },
  ];

  const [events, setEvents] = useState([
    {
      id: 1,
      type: 'success',
      content: 'Product Launch',
      date: moment().add(7, 'days'),
      time: '10:00 AM',
      description: 'Launch of our new product line.',
    },
    {
      id: 2,
      type: 'warning',
      content: 'Board Meeting',
      date: moment().add(3, 'days'),
      time: '2:00 PM',
      description: 'Quarterly board meeting to discuss company performance.',
    },
    {
      id: 3,
      type: 'error',
      content: 'Project Deadline',
      date: moment().add(1, 'days'),
      time: '11:59 PM',
      description: 'Deadline for the Customer Portal Upgrade project.',
    },
    {
      id: 4,
      type: 'info',
      content: 'Team Building',
      date: moment().add(14, 'days'),
      time: 'All Day',
      description: 'Company-wide team building event.',
    },
    {
      id: 5,
      type: 'success',
      content: 'Client Meeting',
      date: moment().add(2, 'days'),
      time: '3:00 PM',
      description: 'Meeting with potential big client.',
    },
  ]);

  const [filteredEmployees, setFilteredEmployees] = useState(employees);
  const [filteredProjects, setFilteredProjects] = useState(projects);

  useEffect(() => {
    const filteredEmps = employees.filter((employee) => {
      const searchMatch =
        employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        employee.department.toLowerCase().includes(searchQuery.toLowerCase());
      const departmentMatch =
        selectedDepartments.length === 0 || selectedDepartments.includes(employee.department);
      return searchMatch && departmentMatch;
    });
    setFilteredEmployees(filteredEmps);

    const filteredProjs = projects.filter((project) => {
      const searchMatch =
        project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.department.toLowerCase().includes(searchQuery.toLowerCase());
      const departmentMatch =
        selectedDepartments.length === 0 || selectedDepartments.includes(project.department);
      return searchMatch && departmentMatch;
    });
    setFilteredProjects(filteredProjs);
  }, [searchQuery, selectedDepartments]);

  const openNotifications = () => {
    notification.open({
      message: 'Notifications',
      description: (
        <List
          dataSource={notifications}
          renderItem={(item) => (
            <List.Item key={item.id}>
              <List.Item.Meta
                avatar={<Avatar icon={<BellOutlined />} />}
                title={item.title}
                description={item.description}
              />
            </List.Item>
          )}
        />
      ),
      duration: 0,
      placement: 'topRight',
    });
  };

  // Styled Components
  const StyledLayout = styled(Layout)`
    min-height: 100vh;
  `;

  const StyledHeader = styled(Header)`
    background: #fff;
    padding: 0 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  `;

  const StyledContent = styled(Content)`
    padding: 24px;
    background: #f0f2f5;
  `;

  const Section = styled.div`
    margin-bottom: 32px;
  `;

  const StyledCard = styled(Card)`
    border-radius: 12px;
    transition: transform 0.3s, box-shadow 0.3s;
    margin-bottom: 24px;
    background: #fff;
    color: #000;
    .ant-card-head {
      background: #fff;
      color: #000;
    }
    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
  `;

  const StyledStatisticCard = styled(StyledCard)`
    text-align: center;
    background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
    color: #fff;
    .ant-statistic-title {
      font-size: 16px;
      margin-bottom: 8px;
      color: #fff;
    }
    .ant-statistic-content {
      font-size: 24px;
      font-weight: bold;
      color: #fff;
    }
  `;

  const EmployeeCard = styled(StyledCard)`
    cursor: pointer;
    height: 100%;
  `;

  const ProjectCard = styled(StyledCard)`
    cursor: pointer;
    height: 100%;
  `;

  // Components
  const HeaderContent = () => (
    <StyledHeader>
      <Title level={2} style={{ margin: 0, color: '#000' }}>
        Business Dashboard
      </Title>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Badge count={notifications.length}>
          <Button
            type="text"
            icon={<BellOutlined style={{ color: '#000' }} />}
            onClick={openNotifications}
          />
        </Badge>
      </div>
    </StyledHeader>
  );

  const EmployeeCardComponent = ({ employee }) => (
    <EmployeeCard onClick={() => handleEmployeeClick(employee)}>
      <Card.Meta
        avatar={<Avatar size={64} icon={<TeamOutlined />} />}
        title={<Text strong>{employee.name}</Text>}
        description={
          <>
            <Tag color="blue">{employee.department}</Tag>
            <Progress percent={employee.performance} size="small" status="active" />
            <Text>Projects: {employee.projects}</Text>
          </>
        }
      />
    </EmployeeCard>
  );

  const ProjectCardComponent = ({ project }) => (
    <ProjectCard onClick={() => handleProjectClick(project)}>
      <Card.Meta
        avatar={<Avatar size={64} icon={<ProjectOutlined />} />}
        title={<Text strong>{project.name}</Text>}
        description={
          <>
            <Tag color="green">{project.department}</Tag>
            <Badge status={getStatusColor(project.status)} text={project.status} />
            <Progress percent={project.progress} size="small" status="active" />
          </>
        }
      />
    </ProjectCard>
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'In Progress':
        return 'processing';
      case 'Completed':
        return 'success';
      case 'Planned':
        return 'default';
      default:
        return 'default';
    }
  };

  const handleEmployeeClick = (employee) => {
    setSelectedEmployee(employee);
    setEmployeeModalVisible(true);
  };

  const handleProjectClick = (project) => {
    setSelectedProject(project);
    setProjectModalVisible(true);
  };

  const chartOptions = {
    title: {
      text: 'Department Performance',
      textStyle: {
        color: '#333',
        fontSize: 18,
        fontWeight: 'normal',
      },
      left: 'center',
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    legend: {
      data: ['Performance', 'Projects'],
      bottom: 0,
      textStyle: { color: '#333' },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '10%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: departments,
      axisLine: {
        lineStyle: {
          color: '#999',
        },
      },
      axisTick: {
        alignWithLabel: true,
      },
    },
    yAxis: {
      type: 'value',
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      splitLine: {
        lineStyle: {
          color: '#f0f0f0',
        },
      },
    },
    series: [
      {
        name: 'Performance',
        type: 'bar',
        data: [92, 88, 94, 87, 91, 89],
        itemStyle: {
          color: '#1890ff',
        },
      },
      {
        name: 'Projects',
        type: 'bar',
        data: [5, 4, 6, 3, 4, 5],
        itemStyle: {
          color: '#13c2c2',
        },
      },
    ],
  };

  const getListData = (value) => {
    return events.filter((event) => moment(event.date).isSame(value, 'day'));
  };

  const dateCellRender = (value) => {
    const listData = getListData(value);
    return (
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {listData.map((item) => (
          <li
            key={item.id}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedEvent(item);
              setEventDetailsModalVisible(true);
            }}
            style={{
              cursor: 'pointer',
              fontSize: '12px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              marginBottom: '4px',
            }}
          >
            <Badge status={item.type} text={item.content} />
          </li>
        ))}
      </ul>
    );
  };

  const CalendarModal = () => (
    <Modal
      title="Full Schedule"
      visible={calendarModalVisible}
      onCancel={() => setCalendarModalVisible(false)}
      footer={null}
      width={1000}
      bodyStyle={{ padding: '24px' }}
    >
      <Calendar dateCellRender={dateCellRender} fullscreen={true} />
    </Modal>
  );

  const EventDetailsModal = () => (
    <Modal
      title="Event Details"
      visible={eventDetailsModalVisible}
      onCancel={() => setEventDetailsModalVisible(false)}
      footer={[
        <Button key="close" onClick={() => setEventDetailsModalVisible(false)}>
          Close
        </Button>,
      ]}
      centered
    >
      {selectedEvent && (
        <div>
          <Title level={4}>{selectedEvent.content}</Title>
          <Text>
            <strong>Date:</strong> {moment(selectedEvent.date).format('MMMM D, YYYY')}
          </Text>
          <br />
          <Text>
            <strong>Time:</strong> {selectedEvent.time}
          </Text>
          <br />
          <Text>
            <strong>Type:</strong>{' '}
            <Badge
              status={selectedEvent.type}
              text={selectedEvent.type.charAt(0).toUpperCase() + selectedEvent.type.slice(1)}
            />
          </Text>
          <p style={{ marginTop: '16px' }}>{selectedEvent.description}</p>
        </div>
      )}
    </Modal>
  );

  const ProjectDetailsModal = () => (
    <Modal
      title="Project Details"
      visible={projectModalVisible}
      onCancel={() => setProjectModalVisible(false)}
      footer={[
        <Button key="close" onClick={() => setProjectModalVisible(false)}>
          Close
        </Button>,
      ]}
      centered
    >
      {selectedProject && (
        <div>
          <Title level={4}>{selectedProject.name}</Title>
          <Tag color="blue">{selectedProject.department}</Tag>
          <Badge
            status={getStatusColor(selectedProject.status)}
            text={selectedProject.status}
            style={{ marginLeft: '8px' }}
          />
          <div style={{ marginTop: '16px' }}>
            <Text strong>Description:</Text>
            <p>{selectedProject.description}</p>
            <Text strong>Team Members:</Text>
            <List
              dataSource={selectedProject.team}
              renderItem={(member) => <List.Item>{member}</List.Item>}
            />
            <Text strong>Progress:</Text>
            <Progress percent={selectedProject.progress} status="active" />
          </div>
        </div>
      )}
    </Modal>
  );

  const EmployeeDetailsModal = () => (
    <Modal
      title="Employee Details"
      visible={employeeModalVisible}
      onCancel={() => setEmployeeModalVisible(false)}
      footer={[
        <Button key="close" onClick={() => setEmployeeModalVisible(false)}>
          Close
        </Button>,
      ]}
      centered
    >
      {selectedEmployee && (
        <div>
          <Title level={4}>{selectedEmployee.name}</Title>
          <Tag color="blue">{selectedEmployee.department}</Tag>
          <div style={{ marginTop: '16px' }}>
            <Text strong>Performance:</Text>
            <Progress percent={selectedEmployee.performance} status="active" />
            <Text strong>Projects:</Text>
            <p>{selectedEmployee.projects}</p>
          </div>
        </div>
      )}
    </Modal>
  );

  return (
    <ConfigProvider>
      <StyledLayout>
        <Layout>
          <HeaderContent />
          <StyledContent>
            {/* Statistics Section */}
            <Section>
              <Row gutter={[24, 24]}>
                <Col xs={24} sm={12} md={6}>
                  <StyledStatisticCard>
                    <Statistic
                      title="Revenue"
                      value={revenue}
                      prefix={<DollarOutlined style={{ color: '#fff' }} />}
                      valueStyle={{ color: '#fff', fontSize: '24px' }}
                    />
                  </StyledStatisticCard>
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <StyledStatisticCard>
                    <Statistic
                      title="Active Projects"
                      value={activeProjects}
                      prefix={<ProjectOutlined style={{ color: '#fff' }} />}
                      valueStyle={{ color: '#fff', fontSize: '24px' }}
                    />
                  </StyledStatisticCard>
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <StyledStatisticCard>
                    <Statistic
                      title="Completed Projects"
                      value={completedProjects}
                      prefix={<CheckCircleOutlined style={{ color: '#fff' }} />}
                      valueStyle={{ color: '#fff', fontSize: '24px' }}
                    />
                  </StyledStatisticCard>
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <StyledStatisticCard>
                    <Statistic
                      title="Team Performance"
                      value={teamPerformance}
                      prefix={<RiseOutlined style={{ color: '#fff' }} />}
                      suffix="%"
                      valueStyle={{ color: '#fff', fontSize: '24px' }}
                    />
                  </StyledStatisticCard>
                </Col>
              </Row>
            </Section>

            {/* Overview and Events Section */}
            <Section>
              <Row gutter={[24, 24]}>
                <Col xs={24} lg={16}>
                  <StyledCard title="Department Overview">
                    <ReactECharts
                      option={chartOptions}
                      style={{ height: '300px' }}
                    />
                  </StyledCard>
                </Col>
                <Col xs={24} lg={8}>
                  <StyledCard title="Upcoming Events">
                    <Timeline>
                      {events.slice(0, 5).map((event) => (
                        <Timeline.Item key={event.id} color={event.type}>
                          <Text strong>{event.content}</Text>
                          <br />
                          <Text type="secondary">
                            {moment(event.date).format('MMM D')} - {event.time}
                          </Text>
                        </Timeline.Item>
                      ))}
                    </Timeline>
                    <Button
                      type="link"
                      onClick={() => setCalendarModalVisible(true)}
                      style={{ padding: 0, marginTop: '16px' }}
                    >
                      <CalendarOutlined /> View Full Calendar
                    </Button>
                  </StyledCard>
                </Col>
              </Row>
            </Section>

            {/* Search and Tabs Section */}
            <Section>
              <StyledCard
                title="Employee & Project Search"
                extra={
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '16px',
                    }}
                  >
                    <Input
                      placeholder="Search employees or projects"
                      prefix={<SearchOutlined />}
                      style={{ width: 250 }}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      value={searchQuery}
                      allowClear
                    />
                    <Select
                      mode="multiple"
                      style={{ width: 300 }}
                      placeholder="Select departments"
                      onChange={setSelectedDepartments}
                      value={selectedDepartments}
                      allowClear
                    >
                      {departments.map((dept) => (
                        <Select.Option key={dept} value={dept}>
                          {dept}
                        </Select.Option>
                      ))}
                    </Select>
                  </div>
                }
              >
                <Tabs defaultActiveKey="1" type="card">
                  <Tabs.TabPane tab="Employees" key="1">
                    <Row gutter={[24, 24]}>
                      {filteredEmployees.map((employee) => (
                        <Col key={employee.id} xs={24} sm={12} md={8} lg={6}>
                          <EmployeeCardComponent employee={employee} />
                        </Col>
                      ))}
                    </Row>
                  </Tabs.TabPane>
                  <Tabs.TabPane tab="Projects" key="2">
                    <Row gutter={[24, 24]}>
                      {filteredProjects.map((project) => (
                        <Col key={project.id} xs={24} sm={12} md={8} lg={6}>
                          <ProjectCardComponent project={project} />
                        </Col>
                      ))}
                    </Row>
                  </Tabs.TabPane>
                </Tabs>
              </StyledCard>
            </Section>
          </StyledContent>
        </Layout>
      </StyledLayout>

      {/* Project Details Modal */}
      <ProjectDetailsModal />

      {/* Modals */}
      <EmployeeDetailsModal />
      <CalendarModal />
      <EventDetailsModal />
    </ConfigProvider>
  );
};

export default BusinessDashboard;