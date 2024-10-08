import React, { useState, useEffect } from 'react';
import {
  Typography,
  Card,
  List,
  Tag,
  Space,
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  Progress,
  Tooltip,
  Collapse,
  Checkbox,
  InputNumber,
  Row,
  Col,
  Divider,
  Statistic,
  notification,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  FilterOutlined,
  UserOutlined,
  ProjectOutlined,
  CheckCircleOutlined,
  SyncOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import moment from 'moment';

const { Title } = Typography;
const { Option } = Select;
const { Panel } = Collapse;

const teamMemberOptions = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve'];
const categoryOptions = ['Development', 'Marketing', 'Design', 'Research'];

const ProjectManagement = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [isProjectModalVisible, setIsProjectModalVisible] = useState(false);
  const [isTaskModalVisible, setIsTaskModalVisible] = useState(false);
  const [projectForm] = Form.useForm();
  const [taskForm] = Form.useForm();
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [currentProject, setCurrentProject] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: [],
    category: [],
    teamMembers: [],
  });
  const [sortOption, setSortOption] = useState('name-asc');

  useEffect(() => {
    const fetchProjects = async () => {
      const mockProjects = [
        {
          id: 1,
          name: 'Website Redesign',
          status: 'In Progress',
          dueDate: '2023-06-30',
          progress: 65,
          description: 'Redesigning company website for better UX',
          category: 'Development',
          teamMembers: ['Alice', 'Bob'],
          tasks: [
            { id: 1, name: 'Design new homepage', status: 'Completed' },
            { id: 2, name: 'Implement responsive design', status: 'In Progress' },
          ],
        },
        {
          id: 2,
          name: 'Mobile App Development',
          status: 'Planning',
          dueDate: '2023-08-15',
          progress: 20,
          description: 'Developing a new mobile app for customers',
          category: 'Development',
          teamMembers: ['Charlie'],
          tasks: [
            { id: 1, name: 'Define app scope', status: 'Completed' },
            { id: 2, name: 'Create wireframes', status: 'Pending' },
          ],
        },
        {
          id: 3,
          name: 'Marketing Campaign',
          status: 'Completed',
          dueDate: '2023-05-31',
          progress: 100,
          description: 'Q2 marketing campaign for product launch',
          category: 'Marketing',
          teamMembers: ['Diana', 'Eve'],
          tasks: [
            { id: 1, name: 'Social media ads', status: 'Completed' },
            { id: 2, name: 'Email marketing', status: 'Completed' },
          ],
        },
      ];
      setProjects(mockProjects);
      applyFilters(searchTerm, filters, mockProjects);
    };
    fetchProjects();
  }, []);

  useEffect(() => {
    const today = moment();
    projects.forEach((project) => {
      const dueDate = moment(project.dueDate);
      if (dueDate.diff(today, 'days') <= 3 && dueDate.diff(today, 'days') >= 0) {
        notification.warning({
          message: 'Project Due Soon',
          description: `The project "${project.name}" is due in ${dueDate.diff(today, 'days')} days.`,
        });
      }
    });
  }, [projects]);

  const showProjectModal = (project = null) => {
    if (project) {
      setEditingProjectId(project.id);
      projectForm.setFieldsValue({
        ...project,
        dueDate: moment(project.dueDate),
      });
    } else {
      setEditingProjectId(null);
      projectForm.resetFields();
    }
    setIsProjectModalVisible(true);
  };

  const handleProjectCancel = () => {
    setIsProjectModalVisible(false);
    projectForm.resetFields();
    setEditingProjectId(null);
  };

  const onProjectFinish = (values) => {
    const newProject = {
      ...values,
      id: editingProjectId || Date.now(),
      dueDate: values.dueDate.format('YYYY-MM-DD'),
      tasks: editingProjectId
        ? projects.find((p) => p.id === editingProjectId).tasks
        : [],
    };

    if (editingProjectId) {
      setProjects(projects.map((p) => (p.id === editingProjectId ? newProject : p)));
    } else {
      setProjects([...projects, newProject]);
    }

    setIsProjectModalVisible(false);
    projectForm.resetFields();
    setEditingProjectId(null);
    applyFilters();
  };

  const deleteProject = (projectId) => {
    Modal.confirm({
      title: 'Delete Project',
      content: 'Are you sure you want to delete this project?',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: () => {
        setProjects(projects.filter((p) => p.id !== projectId));
        applyFilters();
      },
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'In Progress':
        return 'blue';
      case 'Planning':
        return 'orange';
      case 'Completed':
        return 'green';
      case 'Pending':
        return 'red';
      default:
        return 'default';
    }
  };

  const showTaskModal = (project, task = null) => {
    setCurrentProject(project);
    if (task) {
      setEditingTaskId(task.id);
      taskForm.setFieldsValue(task);
    } else {
      setEditingTaskId(null);
      taskForm.resetFields();
    }
    setIsTaskModalVisible(true);
  };

  const handleTaskCancel = () => {
    setIsTaskModalVisible(false);
    taskForm.resetFields();
    setEditingTaskId(null);
    setCurrentProject(null);
  };

  const onTaskFinish = (values) => {
    const newTask = {
      ...values,
      id: editingTaskId || Date.now(),
    };

    const updatedProjects = projects.map((project) => {
      if (project.id === currentProject.id) {
        const tasks = editingTaskId
          ? project.tasks.map((t) => (t.id === editingTaskId ? newTask : t))
          : [...project.tasks, newTask];
        return { ...project, tasks };
      }
      return project;
    });

    setProjects(updatedProjects);
    setIsTaskModalVisible(false);
    taskForm.resetFields();
    setEditingTaskId(null);
    setCurrentProject(null);
    applyFilters();
  };

  const deleteTask = (projectId, taskId) => {
    Modal.confirm({
      title: 'Delete Task',
      content: 'Are you sure you want to delete this task?',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: () => {
        const updatedProjects = projects.map((project) => {
          if (project.id === projectId) {
            const tasks = project.tasks.filter((t) => t.id !== taskId);
            return { ...project, tasks };
          }
          return project;
        });
        setProjects(updatedProjects);
        applyFilters();
      },
    });
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    applyFilters(e.target.value, filters);
  };

  const handleFilterChange = (type, value) => {
    const newFilters = { ...filters, [type]: value };
    setFilters(newFilters);
    applyFilters(searchTerm, newFilters);
  };

  const handleSortChange = (value) => {
    setSortOption(value);
    applyFilters(searchTerm, filters, projects, value);
  };

  const applyFilters = (
    search = searchTerm,
    filterOptions = filters,
    projectList = projects,
    sort = sortOption
  ) => {
    let tempProjects = projectList;

    if (search) {
      tempProjects = tempProjects.filter((project) =>
        project.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (filterOptions.status.length) {
      tempProjects = tempProjects.filter((project) =>
        filterOptions.status.includes(project.status)
      );
    }

    if (filterOptions.category.length) {
      tempProjects = tempProjects.filter((project) =>
        filterOptions.category.includes(project.category)
      );
    }

    if (filterOptions.teamMembers.length) {
      tempProjects = tempProjects.filter((project) =>
        project.teamMembers.some((member) =>
          filterOptions.teamMembers.includes(member)
        )
      );
    }

    // Sorting
    switch (sort) {
      case 'name-asc':
        tempProjects.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        tempProjects.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'dueDate-asc':
        tempProjects.sort((a, b) => moment(a.dueDate).diff(moment(b.dueDate)));
        break;
      case 'dueDate-desc':
        tempProjects.sort((a, b) => moment(b.dueDate).diff(moment(a.dueDate)));
        break;
      case 'progress-asc':
        tempProjects.sort((a, b) => a.progress - b.progress);
        break;
      case 'progress-desc':
        tempProjects.sort((a, b) => b.progress - a.progress);
        break;
      default:
        break;
    }

    setFilteredProjects([...tempProjects]);
  };

  // Dashboard statistics
  const totalProjects = projects.length;
  const statusCounts = projects.reduce((acc, project) => {
    acc[project.status] = (acc[project.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <div style={{ padding: '20px' }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
          }}
        >
          <Title level={2} style={{ margin: 0, color: '#000' }}>
            Project Management Dashboard
          </Title>
          <Space wrap>
            <Input
              placeholder="Search projects"
              prefix={<SearchOutlined />}
              value={searchTerm}
              onChange={handleSearch}
              style={{ width: 200 }}
              allowClear
            />
            <Select
              value={sortOption}
              onChange={handleSortChange}
              style={{ width: 180 }}
            >
              <Option value="name-asc">Name (A-Z)</Option>
              <Option value="name-desc">Name (Z-A)</Option>
              <Option value="dueDate-asc">Due Date (Soonest)</Option>
              <Option value="dueDate-desc">Due Date (Latest)</Option>
              <Option value="progress-asc">Progress (Ascending)</Option>
              <Option value="progress-desc">Progress (Descending)</Option>
            </Select>
            <Button
              icon={<FilterOutlined />}
              onClick={() => setFilters({ status: [], category: [], teamMembers: [] })}
            >
              Reset Filters
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => showProjectModal()}
            >
              Add Project
            </Button>
          </Space>
        </div>

        {/* Dashboard Statistics */}
        <Row gutter={16} style={{ marginBottom: '20px' }}>
          <Col span={6}>
            <Card>
              <Statistic
                title="Total Projects"
                value={totalProjects}
                prefix={<ProjectOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Completed Projects"
                value={statusCounts['Completed'] || 0}
                valueStyle={{ color: getStatusColor('Completed') }}
                prefix={<CheckCircleOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="In Progress"
                value={statusCounts['In Progress'] || 0}
                valueStyle={{ color: getStatusColor('In Progress') }}
                prefix={<SyncOutlined spin />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Pending Projects"
                value={statusCounts['Pending'] || 0}
                valueStyle={{ color: getStatusColor('Pending') }}
                prefix={<ExclamationCircleOutlined />}
              />
            </Card>
          </Col>
        </Row>

        <Collapse>
          <Panel header="Filters" key="1">
            <Row gutter={16}>
              <Col span={8}>
                <Checkbox.Group
                  value={filters.status}
                  onChange={(value) => handleFilterChange('status', value)}
                >
                  <Title level={5}>Status</Title>
                  <Space direction="vertical">
                    <Checkbox value="Planning">Planning</Checkbox>
                    <Checkbox value="In Progress">In Progress</Checkbox>
                    <Checkbox value="Completed">Completed</Checkbox>
                    <Checkbox value="Pending">Pending</Checkbox>
                  </Space>
                </Checkbox.Group>
              </Col>
              <Col span={8}>
                <Checkbox.Group
                  value={filters.category}
                  onChange={(value) => handleFilterChange('category', value)}
                >
                  <Title level={5}>Category</Title>
                  <Space direction="vertical">
                    {categoryOptions.map((category) => (
                      <Checkbox key={category} value={category}>
                        {category}
                      </Checkbox>
                    ))}
                  </Space>
                </Checkbox.Group>
              </Col>
              <Col span={8}>
                <Checkbox.Group
                  value={filters.teamMembers}
                  onChange={(value) => handleFilterChange('teamMembers', value)}
                >
                  <Title level={5}>Team Members</Title>
                  <Space direction="vertical">
                    {teamMemberOptions.map((member) => (
                      <Checkbox key={member} value={member}>
                        {member}
                      </Checkbox>
                    ))}
                  </Space>
                </Checkbox.Group>
              </Col>
            </Row>
          </Panel>
        </Collapse>

        <List
          grid={{ gutter: 24, column: 3 }}
          dataSource={filteredProjects}
          locale={{ emptyText: 'No projects found' }}
          renderItem={(project) => (
            <List.Item>
              <Card
                title={project.name}
                extra={
                  <Space>
                    <Tooltip title="Edit Project">
                      <Button
                        icon={<EditOutlined />}
                        onClick={() => showProjectModal(project)}
                      />
                    </Tooltip>
                    <Tooltip title="Delete Project">
                      <Button
                        icon={<DeleteOutlined />}
                        onClick={() => deleteProject(project.id)}
                        danger
                      />
                    </Tooltip>
                  </Space>
                }
                style={{ height: '100%' }}
              >
                <Space direction="vertical" size="small" style={{ width: '100%' }}>
                  <div>
                    Status:{' '}
                    <Tag color={getStatusColor(project.status)}>{project.status}</Tag>
                  </div>
                  <div>
                    Category: <Tag color="purple">{project.category}</Tag>
                  </div>
                  <div>Due Date: {moment(project.dueDate).format('LL')}</div>
                  <div>
                    Progress:{' '}
                    <Progress
                      percent={project.progress}
                      size="small"
                      status={project.progress === 100 ? 'success' : 'active'}
                    />
                  </div>
                  <div>
                    Team Members:{' '}
                    {project.teamMembers.map((member) => (
                      <Tag icon={<UserOutlined />} key={member}>
                        {member}
                      </Tag>
                    ))}
                  </div>
                  <div>Description: {project.description}</div>
                  <Divider />
                  <div>
                    <Space style={{ marginBottom: '10px' }}>
                      <Title level={5}>Tasks</Title>
                      <Button
                        size="small"
                        icon={<PlusOutlined />}
                        onClick={() => showTaskModal(project)}
                      >
                        Add Task
                      </Button>
                    </Space>
                    <List
                      dataSource={project.tasks}
                      locale={{ emptyText: 'No tasks' }}
                      renderItem={(task) => (
                        <List.Item
                          actions={[
                            <Tooltip title="Edit Task" key="edit">
                              <Button
                                size="small"
                                icon={<EditOutlined />}
                                onClick={() => showTaskModal(project, task)}
                              />
                            </Tooltip>,
                            <Tooltip title="Delete Task" key="delete">
                              <Button
                                size="small"
                                icon={<DeleteOutlined />}
                                onClick={() => deleteTask(project.id, task.id)}
                                danger
                              />
                            </Tooltip>,
                          ]}
                        >
                          <List.Item.Meta
                            title={task.name}
                            description={
                              <>
                                Status:{' '}
                                <Tag color={getStatusColor(task.status)}>{task.status}</Tag>
                              </>
                            }
                          />
                        </List.Item>
                      )}
                    />
                  </div>
                </Space>
              </Card>
            </List.Item>
          )}
        />
      </Space>

      {/* Project Modal */}
      <Modal
        title={editingProjectId ? 'Edit Project' : 'Add New Project'}
        visible={isProjectModalVisible}
        onCancel={handleProjectCancel}
        footer={null}
      >
        <Form
          form={projectForm}
          layout="vertical"
          onFinish={onProjectFinish}
          initialValues={{ progress: 0 }}
        >
          <Form.Item
            name="name"
            label="Project Name"
            rules={[{ required: true, message: 'Please enter project name' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: 'Please select status' }]}
          >
            <Select>
              <Option value="Planning">Planning</Option>
              <Option value="In Progress">In Progress</Option>
              <Option value="Completed">Completed</Option>
              <Option value="Pending">Pending</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="category"
            label="Category"
            rules={[{ required: true, message: 'Please select category' }]}
          >
            <Select>
              {categoryOptions.map((category) => (
                <Option key={category} value={category}>
                  {category}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="dueDate"
            label="Due Date"
            rules={[{ required: true, message: 'Please select due date' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="progress"
            label="Progress"
            rules={[
              { required: true, message: 'Please enter progress' },
              { type: 'number', min: 0, max: 100, message: 'Progress must be between 0 and 100' },
            ]}
          >
            <InputNumber min={0} max={100} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="teamMembers" label="Team Members">
            <Select mode="multiple">
              {teamMemberOptions.map((member) => (
                <Option key={member} value={member}>
                  {member}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editingProjectId ? 'Update Project' : 'Add Project'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Task Modal */}
      <Modal
        title={editingTaskId ? 'Edit Task' : 'Add New Task'}
        visible={isTaskModalVisible}
        onCancel={handleTaskCancel}
        footer={null}
      >
        <Form
          form={taskForm}
          layout="vertical"
          onFinish={onTaskFinish}
          initialValues={{ status: 'Pending' }}
        >
          <Form.Item
            name="name"
            label="Task Name"
            rules={[{ required: true, message: 'Please enter task name' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: 'Please select status' }]}
          >
            <Select>
              <Option value="Pending">Pending</Option>
              <Option value="In Progress">In Progress</Option>
              <Option value="Completed">Completed</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editingTaskId ? 'Update Task' : 'Add Task'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProjectManagement;