import React, { useState, useEffect } from 'react';
import {
  Layout,
  Typography,
  Card,
  Row,
  Col,
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  Table,
  Tabs,
  Statistic,
  Tooltip,
  message,
  Progress,
  Space,
  Drawer,
  InputNumber,
  List,
  Descriptions,
  Radio,
  Avatar,
} from 'antd';
import {
  PlusOutlined,
  BarChartOutlined,
  DollarOutlined,
  ShoppingCartOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  ReloadOutlined,
  DownloadOutlined,
  InfoCircleOutlined,
  PieChartOutlined,
} from '@ant-design/icons';
import styled from 'styled-components';
import 'antd/dist/reset.css';
import moment from 'moment';
import ReactECharts from 'echarts-for-react';
import * as XLSX from 'xlsx';

const { Title } = Typography;
const { Option } = Select;

const AccountingDashboard = () => {
  const [incomeModalVisible, setIncomeModalVisible] = useState(false);
  const [expenseModalVisible, setExpenseModalVisible] = useState(false);
  const [incomeData, setIncomeData] = useState([]);
  const [expenseData, setExpenseData] = useState([]);
  const [selectedTab, setSelectedTab] = useState('1');

  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [netProfit, setNetProfit] = useState(0);

  const [budgetData, setBudgetData] = useState({});
  const [budgetModalVisible, setBudgetModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [cashFlowForecast, setCashFlowForecast] = useState([]);
  const [currencyRates, setCurrencyRates] = useState({});
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [financialMetrics, setFinancialMetrics] = useState({});
  const [metricsDrawerVisible, setMetricsDrawerVisible] = useState(false);

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [expenseBreakdownTimeRange, setExpenseBreakdownTimeRange] = useState('month');
  const [selectedExpenseCategory, setSelectedExpenseCategory] = useState(null);

  useEffect(() => {
    // Load data from localStorage
    const storedIncomeData = JSON.parse(localStorage.getItem('incomeData')) || [];
    const storedExpenseData = JSON.parse(localStorage.getItem('expenseData')) || [];

    if (storedIncomeData.length === 0 && storedExpenseData.length === 0) {
      // Add dummy data if no data is stored
      initializeDummyData();
    } else {
      setIncomeData(storedIncomeData);
      setExpenseData(storedExpenseData);
    }

    // Load budget data
    const storedBudgetData = JSON.parse(localStorage.getItem('budgetData')) || {};
    setBudgetData(storedBudgetData);

    // Fetch currency rates
    fetchCurrencyRates();

    // Generate cash flow forecast with more realistic data
    generateCashFlowForecast();

    // Calculate financial metrics
    calculateFinancialMetrics();
  }, []);

  useEffect(() => {
    const income = incomeData.reduce((sum, item) => sum + item.amount, 0);
    const expense = expenseData.reduce((sum, item) => sum + item.amount, 0);
    setTotalIncome(income);
    setTotalExpense(expense);
    setNetProfit(income - expense);

    // Save data to localStorage
    localStorage.setItem('incomeData', JSON.stringify(incomeData));
    localStorage.setItem('expenseData', JSON.stringify(expenseData));

    // Save budget data to localStorage
    localStorage.setItem('budgetData', JSON.stringify(budgetData));

    // Recalculate financial metrics when data changes
    calculateFinancialMetrics();
  }, [incomeData, expenseData, budgetData]);

  const fetchCurrencyRates = async () => {
    try {
      const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
      const data = await response.json();
      setCurrencyRates(data.rates);
    } catch (error) {
      console.error('Error fetching currency rates:', error);
    }
  };

  const generateCashFlowForecast = () => {
    const forecastMonths = 6;
    const forecast = [];
    const currentMonth = moment().month();

    for (let i = 0; i < forecastMonths; i++) {
      const month = moment().add(i, 'months');
      const monthIndex = (currentMonth + i) % 12;
      
      // Use the data from chartOptions to create more realistic projections
      const baseIncome = chartOptions.series[0].data[monthIndex];
      const baseExpense = chartOptions.series[1].data[monthIndex];
      
      const projectedIncome = baseIncome * (1 + 0.03 * i); // Assume 3% monthly growth
      const projectedExpense = baseExpense * (1 + 0.02 * i); // Assume 2% monthly growth
      
      forecast.push({
        month: month.format('MMM YYYY'),
        income: projectedIncome,
        expense: projectedExpense,
        cashFlow: projectedIncome - projectedExpense,
      });
    }

    setCashFlowForecast(forecast);
  };

  const calculateFinancialMetrics = () => {
    const metrics = {
      profitMargin: ((netProfit / totalIncome) * 100).toFixed(2),
      expenseRatio: ((totalExpense / totalIncome) * 100).toFixed(2),
      breakEvenPoint: (totalExpense / (totalIncome / incomeData.length)).toFixed(2),
      currentRatio: (totalIncome / totalExpense).toFixed(2),
    };
    setFinancialMetrics(metrics);
  };

  // Styled Components
  const StyledLayout = styled(Layout)`
    min-height: 100vh;
    background: #f0f2f5;
  `;

  const StyledHeader = styled(Layout.Header)`
    background: #fff;
    padding: 0 24px;
    box-shadow: 0 2px 8px #f0f1f2;
    display: flex;
    align-items: center;
    justify-content: space-between;
  `;

  const StyledContent = styled(Layout.Content)`
    padding: 24px;
    margin: 24px;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  `;

  const Section = styled.div`
    margin-bottom: 32px;
  `;

  const StyledCard = styled(Card)`
    border-radius: 12px;
    transition: transform 0.3s, box-shadow 0.3s;
    margin-bottom: 24px;
    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
  `;

  const StyledStatisticCard = styled(StyledCard)`
    text-align: center;
    background: linear-gradient(135deg, #8fd3f4 0%, #84fab0 100%);
    color: #fff;
    .ant-statistic-title {
      font-size: 16px;
      margin-bottom: 8px;
    }
    .ant-statistic-content {
      font-size: 24px;
      font-weight: bold;
    }
  `;

  const Header = () => (
    <StyledHeader>
      <Title level={2} style={{ margin: 0, color: '#000' }}>
        Accounting Dashboard
      </Title>
    </StyledHeader>
  );

  const columns = [
    {
      title: 'Date',
      dataIndex: 'date',
      render: (date) => moment(date).format('YYYY-MM-DD'),
      sorter: (a, b) => moment(a.date) - moment(b.date),
    },
    {
      title: 'Category',
      dataIndex: 'category',
      filters: [
        { text: 'Sales', value: 'Sales' },
        { text: 'Services', value: 'Services' },
        { text: 'Rent', value: 'Rent' },
        { text: 'Utilities', value: 'Utilities' },
        { text: 'Miscellaneous', value: 'Miscellaneous' },
      ],
      onFilter: (value, record) => record.category.includes(value),
    },
    {
      title: 'Description',
      dataIndex: 'description',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      render: (amount) => `$${amount.toFixed(2)}`,
      sorter: (a, b) => a.amount - b.amount,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <Space size="small">
          <Button size="small" onClick={() => handleEditTransaction(record)}>Edit</Button>
          <Button size="small" danger onClick={() => handleDeleteTransaction(record)}>Delete</Button>
        </Space>
      ),
    },
  ];

  const incomeCategories = ['Sales', 'Services', 'Interest', 'Other'];
  const expenseCategories = ['Rent', 'Utilities', 'Salaries', 'Supplies', 'Other'];

  const chartOptions = {
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      data: ['Income', 'Expense'],
      bottom: 0,
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '10%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        name: 'Income',
        type: 'bar',
        data: [4200, 3800, 5100, 5600, 4900, 6300, 5800, 6100, 5400, 5900, 6500, 7200],
        itemStyle: {
          color: '#73d13d',
        },
      },
      {
        name: 'Expense',
        type: 'bar',
        data: [3800, 3500, 4200, 4800, 4300, 5100, 4900, 5300, 4700, 5100, 5600, 6100],
        itemStyle: {
          color: '#ff4d4f',
        },
      },
    ],
  };

  // Enhanced chart options
  const enhancedChartOptions = {
    ...chartOptions,
    tooltip: {
      ...chartOptions.tooltip,
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985'
        }
      }
    },
    series: [
      {
        ...chartOptions.series[0],
        areaStyle: {
          opacity: 0.8,
          color: 'rgba(115, 209, 61, 0.3)'
        },
        smooth: true
      },
      {
        ...chartOptions.series[1],
        areaStyle: {
          opacity: 0.8,
          color: 'rgba(255, 77, 79, 0.3)'
        },
        smooth: true
      }
    ]
  };

  function calculateMonthlyTotals(data) {
    const months = [...Array(12).keys()].map((i) => moment().month(i).format('MMM'));
    const totals = months.map((month) => {
      const monthlyTotal = data
        .filter((item) => moment(item.date).format('MMM') === month)
        .reduce((sum, item) => sum + item.amount, 0);
      return monthlyTotal;
    });
    return totals;
  }

  const handleAddIncome = (values) => {
    const newIncome = {
      key: incomeData.length + 1,
      ...values,
      amount: parseFloat(values.amount),
    };
    setIncomeData([...incomeData, newIncome]);
    message.success('Income added successfully');
    setIncomeModalVisible(false);
  };

  const handleAddExpense = (values) => {
    const newExpense = {
      key: expenseData.length + 1,
      ...values,
      amount: parseFloat(values.amount),
    };
    setExpenseData([...expenseData, newExpense]);
    message.success('Expense added successfully');
    setExpenseModalVisible(false);
  };

  const initializeDummyData = () => {
    const dummyIncome = [
      {
        key: 1,
        date: moment().subtract(10, 'days'),
        category: 'Sales',
        description: 'Product A sale',
        amount: 5000,
      },
      {
        key: 2,
        date: moment().subtract(20, 'days'),
        category: 'Services',
        description: 'Consulting service',
        amount: 2000,
      },
      {
        key: 3,
        date: moment().subtract(30, 'days'),
        category: 'Interest',
        description: 'Bank interest',
        amount: 150,
      },
      // New income transaction
      {
        key: 4,
        date: moment().subtract(5, 'days'),
        category: 'Sales',
        description: 'Product B sale',
        amount: 3500,
      },
      {
        key: 5,
        date: moment().subtract(2, 'days'),
        category: 'Services',
        description: 'Web development project',
        amount: 4500,
      },
    ];

    const dummyExpenses = [
      {
        key: 1,
        date: moment().subtract(5, 'days'),
        category: 'Rent',
        description: 'Office rent',
        amount: 1000,
      },
      {
        key: 2,
        date: moment().subtract(15, 'days'),
        category: 'Utilities',
        description: 'Electricity bill',
        amount: 300,
      },
      {
        key: 3,
        date: moment().subtract(25, 'days'),
        category: 'Salaries',
        description: 'Staff salaries',
        amount: 4000,
      },
      // New expense transaction
      {
        key: 4,
        date: moment().subtract(2, 'days'),
        category: 'Supplies',
        description: 'Office supplies',
        amount: 250,
      },
      {
        key: 5,
        date: moment().subtract(1, 'days'),
        category: 'Marketing',
        description: 'Social media advertising',
        amount: 750,
      },
    ];

    setIncomeData(dummyIncome);
    setExpenseData(dummyExpenses);
  };

  const handleRefreshData = () => {
    message.success('Data refreshed successfully');
    // Additional logic can be added here if needed
  };

  const handleEditTransaction = (record) => {
    setEditingTransaction(record);
    setEditModalVisible(true);
  };

  const handleDeleteTransaction = (record) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this transaction?',
      content: 'This action cannot be undone.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        if (record.amount >= 0) {
          // Delete income transaction
          setIncomeData(incomeData.filter(item => item.key !== record.key));
          message.success('Income transaction deleted successfully');
        } else {
          // Delete expense transaction
          setExpenseData(expenseData.filter(item => item.key !== record.key));
          message.success('Expense transaction deleted successfully');
        }
      },
    });
  };

  const handleAddBudget = (values) => {
    const newBudget = {
      ...budgetData,
      [values.category]: parseFloat(values.amount),
    };
    setBudgetData(newBudget);
    message.success('Budget updated successfully');
    setBudgetModalVisible(false);
  };

  const handleExportData = () => {
    const wb = XLSX.utils.book_new();
    const incomeWS = XLSX.utils.json_to_sheet(incomeData);
    const expenseWS = XLSX.utils.json_to_sheet(expenseData);
    XLSX.utils.book_append_sheet(wb, incomeWS, 'Income');
    XLSX.utils.book_append_sheet(wb, expenseWS, 'Expenses');
    XLSX.writeFile(wb, 'accounting_data.xlsx');
    message.success('Data exported successfully');
  };

  const handleSearch = (value) => {
    setSearchText(value);
  };

  const filteredIncomeData = incomeData.filter(
    (item) =>
      item.description.toLowerCase().includes(searchText.toLowerCase()) ||
      item.category.toLowerCase().includes(searchText.toLowerCase())
  );

  const filteredExpenseData = expenseData.filter(
    (item) =>
      item.description.toLowerCase().includes(searchText.toLowerCase()) ||
      item.category.toLowerCase().includes(searchText.toLowerCase())
  );

  const convertCurrency = (amount) => {
    return (amount * currencyRates[selectedCurrency]).toFixed(2);
  };

  const expensePieChartOptions = {
    title: {
      text: 'Expense Breakdown',
      left: 'center',
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: ${c} ({d}%)',
    },
    series: [
      {
        name: 'Expenses',
        type: 'pie',
        radius: '50%',
        data: expenseCategories.map((category) => ({
          name: category,
          value: expenseData
            .filter((item) => item.category === category)
            .reduce((sum, item) => sum + item.amount, 0),
        })),
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },
    ],
  };

  const cashFlowForecastOptions = {
    title: {
      text: 'Cash Flow Forecast',
      left: 'center',
    },
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      data: ['Income', 'Expense', 'Cash Flow'],
      bottom: 0,
    },
    xAxis: {
      type: 'category',
      data: cashFlowForecast.map((item) => item.month),
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        name: 'Income',
        type: 'line',
        data: cashFlowForecast.map((item) => item.income),
        itemStyle: {
          color: '#73d13d',
        },
      },
      {
        name: 'Expense',
        type: 'line',
        data: cashFlowForecast.map((item) => item.expense),
        itemStyle: {
          color: '#ff4d4f',
        },
      },
      {
        name: 'Cash Flow',
        type: 'bar',
        data: cashFlowForecast.map((item) => item.cashFlow),
        itemStyle: {
          color: '#1890ff',
        },
      },
    ],
  };

  // Enhanced FinancialHealthIndicator component
  const FinancialHealthIndicator = () => {
    const healthScore = ((netProfit / totalIncome) * 100).toFixed(2);
    const getHealthColor = (score) => {
      if (score > 20) return '#52c41a';
      if (score > 10) return '#faad14';
      return '#f5222d';
    };

    const getHealthStatus = (score) => {
      if (score > 20) return 'Excellent';
      if (score > 10) return 'Good';
      if (score > 0) return 'Fair';
      return 'Poor';
    };

    return (
      <StyledCard>
        <Title level={4}>Financial Health</Title>
        <Row gutter={[16, 16]} align="middle">
          <Col span={12}>
            <Progress
              type="dashboard"
              percent={parseFloat(healthScore)}
              format={(percent) => `${percent.toFixed(2)}%`}
              strokeColor={getHealthColor(healthScore)}
            />
          </Col>
          <Col span={12}>
            <Statistic
              title="Health Status"
              value={getHealthStatus(healthScore)}
              valueStyle={{ color: getHealthColor(healthScore) }}
            />
            <Statistic
              title="Profit Margin"
              value={healthScore}
              precision={2}
              suffix="%"
              valueStyle={{ color: getHealthColor(healthScore) }}
            />
          </Col>
        </Row>
        <Tooltip title="Financial health is based on your profit margin. A higher percentage indicates better financial health.">
          <InfoCircleOutlined style={{ fontSize: '16px', marginTop: '16px' }} />
        </Tooltip>
      </StyledCard>
    );
  };

  // Updated FinancialRatios component
  const FinancialRatios = () => {
    const currentRatio = totalIncome / totalExpense;
    const debtToEquityRatio = totalExpense / (totalIncome - totalExpense);
    const returnOnAssets = (netProfit / totalIncome) * 100;

    return (
      <StyledCard title="Financial Ratios" style={{ marginTop: '24px' }}>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Statistic
              title="Current Ratio"
              value={currentRatio}
              precision={2}
              valueStyle={{ color: currentRatio >= 1 ? '#3f8600' : '#cf1322' }}
              suffix={
                <Tooltip title="A current ratio of 1 or higher is generally good. It indicates your ability to pay short-term obligations.">
                  <InfoCircleOutlined style={{ fontSize: '16px' }} />
                </Tooltip>
              }
            />
          </Col>
          <Col span={24}>
            <Statistic
              title="Debt to Equity"
              value={debtToEquityRatio}
              precision={2}
              valueStyle={{ color: debtToEquityRatio <= 2 ? '#3f8600' : '#cf1322' }}
              suffix={
                <Tooltip title="A lower debt to equity ratio indicates a more financially stable business. Generally, a ratio below 2 is considered good.">
                  <InfoCircleOutlined style={{ fontSize: '16px' }} />
                </Tooltip>
              }
            />
          </Col>
          <Col span={24}>
            <Statistic
              title="Return on Assets"
              value={returnOnAssets}
              precision={2}
              suffix="%"
              valueStyle={{ color: returnOnAssets > 5 ? '#3f8600' : '#cf1322' }}
              prefix={
                <Tooltip title="Return on Assets (ROA) shows how efficiently a company is using its assets to generate profit. A higher percentage is better.">
                  <InfoCircleOutlined style={{ fontSize: '16px' }} />
                </Tooltip>
              }
            />
          </Col>
        </Row>
      </StyledCard>
    );
  };

  // Updated RecentTransactions component
  const RecentTransactions = () => {
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const allTransactions = [...incomeData, ...expenseData].sort((a, b) => moment(b.date) - moment(a.date)).slice(0, 7);

    const handleTransactionClick = (transaction) => {
      setSelectedTransaction(transaction);
    };

    const handleCloseModal = () => {
      setSelectedTransaction(null);
    };

    return (
      <StyledCard title="Recent Transactions">
        <List
          itemLayout="horizontal"
          dataSource={allTransactions}
          renderItem={(item) => (
            <List.Item
              style={{ cursor: 'pointer' }}
              onClick={() => handleTransactionClick(item)}
            >
              <List.Item.Meta
                avatar={item.amount > 0 ? <ArrowUpOutlined style={{ color: '#52c41a' }} /> : <ArrowDownOutlined style={{ color: '#f5222d' }} />}
                title={`${item.category} - ${moment(item.date).format('MMM DD, YYYY')}`}
                description={item.description}
              />
              <div style={{ color: item.amount > 0 ? '#52c41a' : '#f5222d' }}>
                {item.amount > 0 ? '+' : '-'}${Math.abs(item.amount).toFixed(2)}
              </div>
            </List.Item>
          )}
        />
        <Modal
          title="Transaction Details"
          visible={!!selectedTransaction}
          onCancel={handleCloseModal}
          footer={null}
        >
          {selectedTransaction && (
            <Descriptions column={1}>
              <Descriptions.Item label="Date">{moment(selectedTransaction.date).format('MMMM DD, YYYY')}</Descriptions.Item>
              <Descriptions.Item label="Category">{selectedTransaction.category}</Descriptions.Item>
              <Descriptions.Item label="Description">{selectedTransaction.description}</Descriptions.Item>
              <Descriptions.Item label="Amount">
                <span style={{ color: selectedTransaction.amount > 0 ? '#52c41a' : '#f5222d' }}>
                  {selectedTransaction.amount > 0 ? '+' : '-'}${Math.abs(selectedTransaction.amount).toFixed(2)}
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="Type">{selectedTransaction.amount > 0 ? 'Income' : 'Expense'}</Descriptions.Item>
            </Descriptions>
          )}
        </Modal>
      </StyledCard>
    );
  };

  // Update the CashFlowTrend component
  const CashFlowTrend = () => {
    const option = {
      title: {
        text: 'Cash Flow Trend',
        left: 'center'
      },
      tooltip: {
        trigger: 'axis',
      },
      xAxis: {
        type: 'category',
        data: cashFlowForecast.map(item => item.month),
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          data: cashFlowForecast.map(item => item.cashFlow),
          type: 'line',
          areaStyle: {},
        }
      ]
    };

    return (
      <StyledCard>
        <ReactECharts option={option} style={{ height: '300px' }} />
      </StyledCard>
    );
  };

  const handleEditSubmit = (values) => {
    const updatedTransaction = {
      ...editingTransaction,
      ...values,
      amount: parseFloat(values.amount),
    };

    if (updatedTransaction.amount >= 0) {
      setIncomeData(incomeData.map(item => 
        item.key === updatedTransaction.key ? updatedTransaction : item
      ));
    } else {
      setExpenseData(expenseData.map(item => 
        item.key === updatedTransaction.key ? updatedTransaction : item
      ));
    }

    message.success('Transaction updated successfully');
    setEditModalVisible(false);
    setEditingTransaction(null);
  };

  // Update the ExpenseBreakdown component
  const ExpenseBreakdown = () => {
    const [chartType, setChartType] = useState('pie');
    const [selectedCategory, setSelectedCategory] = useState(null);

    // Add this new state for dummy data
    const [dummyTopExpenses, setDummyTopExpenses] = useState({});

    // Add this useEffect to initialize dummy data
    useEffect(() => {
      const dummyData = {
        Rent: [
          { date: '2023-05-01', description: 'Office Rent - May', amount: 5000 },
          { date: '2023-04-01', description: 'Office Rent - April', amount: 5000 },
          { date: '2023-03-01', description: 'Office Rent - March', amount: 4800 },
          { date: '2023-02-01', description: 'Office Rent - February', amount: 4800 },
          { date: '2023-01-01', description: 'Office Rent - January', amount: 4800 },
        ],
        Utilities: [
          { date: '2023-05-15', description: 'Electricity Bill', amount: 850 },
          { date: '2023-04-15', description: 'Electricity Bill', amount: 780 },
          { date: '2023-05-10', description: 'Water Bill', amount: 200 },
          { date: '2023-04-10', description: 'Water Bill', amount: 180 },
          { date: '2023-05-05', description: 'Internet and Phone', amount: 300 },
        ],
        Salaries: [
          { date: '2023-05-31', description: 'Employee Salaries - May', amount: 25000 },
          { date: '2023-04-30', description: 'Employee Salaries - April', amount: 24000 },
          { date: '2023-03-31', description: 'Employee Salaries - March', amount: 24000 },
          { date: '2023-05-15', description: 'Contractor Payment', amount: 3000 },
          { date: '2023-04-15', description: 'Contractor Payment', amount: 2800 },
        ],
        Supplies: [
          { date: '2023-05-20', description: 'Office Supplies Restock', amount: 500 },
          { date: '2023-04-18', description: 'Printer Ink and Paper', amount: 300 },
          { date: '2023-05-10', description: 'Cleaning Supplies', amount: 150 },
          { date: '2023-03-25', description: 'New Office Chairs (5)', amount: 1000 },
          { date: '2023-02-15', description: 'Stationery Order', amount: 250 },
        ],
        Marketing: [
          { date: '2023-05-25', description: 'Social Media Ad Campaign', amount: 2000 },
          { date: '2023-04-20', description: 'Trade Show Expenses', amount: 3500 },
          { date: '2023-05-15', description: 'Google Ads', amount: 1500 },
          { date: '2023-03-10', description: 'Marketing Consultant Fee', amount: 1200 },
          { date: '2023-05-05', description: 'Promotional Materials', amount: 800 },
        ],
      };
      setDummyTopExpenses(dummyData);
    }, []);

    const getFilteredExpenses = () => {
      let startDate;
      switch (expenseBreakdownTimeRange) {
        case 'week':
          startDate = moment().subtract(1, 'week');
          break;
        case 'month':
          startDate = moment().subtract(1, 'month');
          break;
        case 'year':
          startDate = moment().subtract(1, 'year');
          break;
        default:
          startDate = moment(0);
      }
      return expenseData.filter(expense => moment(expense.date).isAfter(startDate));
    };

    const filteredExpenses = getFilteredExpenses();

    const getCategoryData = () => {
      const categoryTotals = {};
      filteredExpenses.forEach(expense => {
        if (categoryTotals[expense.category]) {
          categoryTotals[expense.category] += expense.amount;
        } else {
          categoryTotals[expense.category] = expense.amount;
        }
      });
      return Object.entries(categoryTotals).map(([category, total]) => ({
        name: category,
        value: total
      }));
    };

    const categoryData = getCategoryData();

    const totalExpenses = categoryData.reduce((sum, item) => sum + item.value, 0);

    const colorPalette = ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf'];

    const pieChartOption = {
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: ${c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        data: categoryData.map(item => item.name)
      },
      series: [
        {
          name: 'Expenses',
          type: 'pie',
          radius: ['50%', '70%'],
          avoidLabelOverlap: false,
          label: {
            show: true,
            position: 'outside',
            formatter: '{b}: ${c} ({d}%)'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: '18',
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: true
          },
          data: categoryData.map((item, index) => ({
            ...item,
            itemStyle: { color: colorPalette[index % colorPalette.length] }
          }))
        }
      ]
    };

    const barChartOption = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },
        formatter: function(params) {
          const data = params[0];
          return `${data.name}: $${data.value.toFixed(2)} (${((data.value / totalExpenses) * 100).toFixed(2)}%)`;
        }
      },
      xAxis: {
        type: 'category',
        data: categoryData.map(item => item.name),
        axisLabel: {
          interval: 0,
          rotate: 30
        }
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: '${value}'
        }
      },
      series: [
        {
          data: categoryData.map((item, index) => ({
            value: item.value,
            itemStyle: { color: colorPalette[index % colorPalette.length] }
          })),
          type: 'bar',
          label: {
            show: true,
            position: 'top',
            formatter: function(params) {
              return `$${params.value.toFixed(2)}`;
            }
          }
        }
      ]
    };

    // Update the handleCategoryClick function
    const handleCategoryClick = (category) => {
      setSelectedCategory(category === selectedCategory ? null : category);
    };

    return (
      <StyledCard
        title={
          <Space>
            <Typography.Text strong>Expense Breakdown</Typography.Text>
            <Select
              value={expenseBreakdownTimeRange}
              onChange={setExpenseBreakdownTimeRange}
              style={{ width: 120 }}
            >
              <Option value="week">Last Week</Option>
              <Option value="month">Last Month</Option>
              <Option value="year">Last Year</Option>
              <Option value="all">All Time</Option>
            </Select>
            <Radio.Group value={chartType} onChange={(e) => setChartType(e.target.value)}>
              <Radio.Button value="pie"><PieChartOutlined /> Pie</Radio.Button>
              <Radio.Button value="bar"><BarChartOutlined /> Bar</Radio.Button>
            </Radio.Group>
          </Space>
        }
        extra={
          <Typography.Text strong>
            Total Expenses: ${totalExpenses.toFixed(2)}
          </Typography.Text>
        }
      >
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}>
            <ReactECharts
              option={chartType === 'pie' ? pieChartOption : barChartOption}
              style={{ height: '400px' }}
              onEvents={{
                click: (params) => handleCategoryClick(params.name)
              }}
            />
          </Col>
          <Col xs={24} lg={12}>
            <List
              header={<div>Expense Categories</div>}
              bordered
              dataSource={categoryData}
              renderItem={(item, index) => (
                <List.Item
                  onClick={() => handleCategoryClick(item.name)}
                  style={{ cursor: 'pointer', backgroundColor: selectedCategory === item.name ? '#f0f0f0' : 'transparent' }}
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar style={{ backgroundColor: colorPalette[index % colorPalette.length] }}>
                        {item.name[0]}
                      </Avatar>
                    }
                    title={item.name}
                    description={`$${item.value.toFixed(2)} (${((item.value / totalExpenses) * 100).toFixed(2)}%)`}
                  />
                  <div>
                    <Progress
                      percent={((item.value / totalExpenses) * 100).toFixed(2)}
                      size="small"
                      strokeColor={colorPalette[index % colorPalette.length]}
                    />
                  </div>
                </List.Item>
              )}
            />
          </Col>
        </Row>
        {selectedCategory && (
          <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
            <Col span={24}>
              <Typography.Title level={5}>{`Top 5 ${selectedCategory} Expenses`}</Typography.Title>
              <List
                dataSource={dummyTopExpenses[selectedCategory] || []}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta
                      title={`${moment(item.date).format('MMM DD, YYYY')} - ${item.description}`}
                      description={selectedCategory}
                    />
                    <div>${item.amount.toFixed(2)}</div>
                  </List.Item>
                )}
              />
            </Col>
          </Row>
        )}
      </StyledCard>
    );
  };

  return (
    <StyledLayout>
      <Header />
      <StyledContent>
        {/* Enhanced Statistics Section */}
        <Section>
          <Row gutter={[24, 24]}>
            <Col xs={24} sm={8}>
              <StyledStatisticCard>
                <Statistic
                  title="Total Income"
                  value={totalIncome}
                  prefix={<DollarOutlined style={{ color: '#fff' }} />}
                  valueStyle={{ color: '#fff', fontSize: '24px' }}
                  precision={2}
                />
                <Progress percent={((totalIncome / (totalIncome + totalExpense)) * 100).toFixed(2)} showInfo={false} strokeColor="#fff" trailColor="rgba(255,255,255,0.3)" />
              </StyledStatisticCard>
            </Col>
            <Col xs={24} sm={8}>
              <StyledStatisticCard>
                <Statistic
                  title="Total Expense"
                  value={totalExpense}
                  prefix={<ShoppingCartOutlined style={{ color: '#fff' }} />}
                  valueStyle={{ color: '#fff', fontSize: '24px' }}
                  precision={2}
                />
                <Progress percent={((totalExpense / (totalIncome + totalExpense)) * 100).toFixed(2)} showInfo={false} strokeColor="#fff" trailColor="rgba(255,255,255,0.3)" />
              </StyledStatisticCard>
            </Col>
            <Col xs={24} sm={8}>
              <StyledStatisticCard>
                <Statistic
                  title="Net Profit"
                  value={netProfit}
                  prefix={
                    netProfit >= 0 ? (
                      <ArrowUpOutlined style={{ color: '#fff' }} />
                    ) : (
                      <ArrowDownOutlined style={{ color: '#fff' }} />
                    )
                  }
                  valueStyle={{ color: '#fff', fontSize: '24px' }}
                  precision={2}
                />
                <Progress percent={((netProfit / totalIncome) * 100).toFixed(2)} showInfo={false} strokeColor="#fff" trailColor="rgba(255,255,255,0.3)" status={netProfit >= 0 ? 'normal' : 'exception'} />
              </StyledStatisticCard>
            </Col>
          </Row>
        </Section>

        {/* Updated Financial Health and Ratios Section */}
        <Section>
          <Row gutter={[24, 24]}>
            <Col xs={24} md={12}>
              <FinancialHealthIndicator />
              <FinancialRatios />
            </Col>
            <Col xs={24} md={12}>
              <RecentTransactions />
            </Col>
          </Row>
        </Section>

        {/* Enhanced Chart Section */}
        <Section>
          <StyledCard
            title="Financial Overview"
            extra={
              <Tooltip title="Refresh Data">
                <Button type="text" icon={<ReloadOutlined />} onClick={handleRefreshData} />
              </Tooltip>
            }
          >
            <ReactECharts option={enhancedChartOptions} style={{ height: '400px' }} />
          </StyledCard>
        </Section>

        {/* New Cash Flow Trend Section */}
        <Section>
          <CashFlowTrend />
        </Section>

        {/* Enhanced Budget Tracking Section */}
        <Section>
          <StyledCard
            title="Budget Tracking"
            extra={
              <Button type="primary" onClick={() => setBudgetModalVisible(true)}>
                Set Budget
              </Button>
            }
          >
            <Row gutter={[16, 16]}>
              {Object.entries(budgetData).map(([category, budget]) => {
                const spent = expenseData
                  .filter((item) => item.category === category)
                  .reduce((sum, item) => sum + item.amount, 0);
                const percentage = ((spent / budget) * 100).toFixed(2);
                return (
                  <Col span={8} key={category}>
                    <Card size="small">
                      <Statistic
                        title={category}
                        value={spent}
                        precision={2}
                        prefix="$"
                        suffix={`/ $${budget.toFixed(2)}`}
                      />
                      <Progress
                        percent={parseFloat(percentage)}
                        status={spent > budget ? 'exception' : 'normal'}
                        format={(percent) => `${percent.toFixed(2)}%`}
                      />
                    </Card>
                  </Col>
                );
              })}
            </Row>
          </StyledCard>
        </Section>

        {/* Replace the existing Expense Breakdown Section with the new one */}
        <Section>
          <ExpenseBreakdown />
        </Section>

        {/* Enhanced Transactions Section */}
        <Section>
          <StyledCard
            title="Transactions"
            extra={
              <Space>
                <Input.Search
                  placeholder="Search transactions"
                  onSearch={handleSearch}
                  style={{ width: 200 }}
                />
                <Select
                  value={selectedCurrency}
                  onChange={(value) => setSelectedCurrency(value)}
                  style={{ width: 100 }}
                >
                  {Object.keys(currencyRates).map((currency) => (
                    <Option key={currency} value={currency}>
                      {currency}
                    </Option>
                  ))}
                </Select>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => setIncomeModalVisible(true)}>
                  Add Income
                </Button>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => setExpenseModalVisible(true)}>
                  Add Expense
                </Button>
                <Button icon={<DownloadOutlined />} onClick={handleExportData}>
                  Export
                </Button>
              </Space>
            }
          >
            <Tabs defaultActiveKey="1">
              <Tabs.TabPane tab="Income" key="1">
                <Table
                  dataSource={filteredIncomeData}
                  columns={columns.map((col) => ({
                    ...col,
                    render: (text, record) =>
                      col.dataIndex === 'amount'
                        ? `${selectedCurrency} ${convertCurrency(record.amount)}`
                        : col.render
                        ? col.render(text, record)
                        : text,
                  }))}
                  pagination={{ pageSize: 5 }}
                />
              </Tabs.TabPane>
              <Tabs.TabPane tab="Expenses" key="2">
                <Table
                  dataSource={filteredExpenseData}
                  columns={columns.map((col) => ({
                    ...col,
                    render: (text, record) =>
                      col.dataIndex === 'amount'
                        ? `${selectedCurrency} ${convertCurrency(record.amount)}`
                        : col.render
                        ? col.render(text, record)
                        : text,
                  }))}
                  pagination={{ pageSize: 5 }}
                />
              </Tabs.TabPane>
            </Tabs>
          </StyledCard>
        </Section>
      </StyledContent>

      {/* Add Income Modal */}
      <Modal
        title="Add Income"
        visible={incomeModalVisible}
        onCancel={() => setIncomeModalVisible(false)}
        footer={null}
      >
        <Form layout="vertical" onFinish={handleAddIncome}>
          <Form.Item
            name="date"
            label="Date"
            rules={[{ required: true, message: 'Please select the date' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="category"
            label="Category"
            rules={[{ required: true, message: 'Please select the category' }]}
          >
            <Select placeholder="Select category">
              {incomeCategories.map((category) => (
                <Option key={category} value={category}>
                  {category}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input placeholder="Enter description" />
          </Form.Item>
          <Form.Item
            name="amount"
            label="Amount"
            rules={[{ required: true, message: 'Please enter the amount' }]}
          >
            <Input type="number" placeholder="Enter amount" min="0" step="0.01" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Add Income
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Add Expense Modal */}
      <Modal
        title="Add Expense"
        visible={expenseModalVisible}
        onCancel={() => setExpenseModalVisible(false)}
        footer={null}
      >
        <Form layout="vertical" onFinish={handleAddExpense}>
          <Form.Item
            name="date"
            label="Date"
            rules={[{ required: true, message: 'Please select the date' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="category"
            label="Category"
            rules={[{ required: true, message: 'Please select the category' }]}
          >
            <Select placeholder="Select category">
              {expenseCategories.map((category) => (
                <Option key={category} value={category}>
                  {category}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input placeholder="Enter description" />
          </Form.Item>
          <Form.Item
            name="amount"
            label="Amount"
            rules={[{ required: true, message: 'Please enter the amount' }]}
          >
            <Input type="number" placeholder="Enter amount" min="0" step="0.01" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Add Expense
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Add Budget Modal */}
      <Modal
        title="Set Budget"
        visible={budgetModalVisible}
        onCancel={() => setBudgetModalVisible(false)}
        footer={null}
      >
        <Form layout="vertical" onFinish={handleAddBudget}>
          <Form.Item
            name="category"
            label="Category"
            rules={[{ required: true, message: 'Please select the category' }]}
          >
            <Select placeholder="Select category">
              {expenseCategories.map((category) => (
                <Option key={category} value={category}>
                  {category}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="amount"
            label="Budget Amount"
            rules={[{ required: true, message: 'Please enter the budget amount' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Set Budget
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Financial Metrics Drawer */}
      <Drawer
        title="Financial Metrics"
        placement="right"
        onClose={() => setMetricsDrawerVisible(false)}
        visible={metricsDrawerVisible}
      >
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Statistic
            title="Profit Margin"
            value={financialMetrics.profitMargin}
            precision={2}
            suffix="%"
            valueStyle={{ color: financialMetrics.profitMargin > 0 ? '#3f8600' : '#cf1322' }}
          />
          <Statistic
            title="Expense Ratio"
            value={financialMetrics.expenseRatio}
            precision={2}
            suffix="%"
            valueStyle={{ color: financialMetrics.expenseRatio < 80 ? '#3f8600' : '#cf1322' }}
          />
          <Statistic
            title="Break-even Point"
            value={financialMetrics.breakEvenPoint}
            precision={2}
            prefix="$"
          />
          <Statistic
            title="Current Ratio"
            value={financialMetrics.currentRatio}
            precision={2}
            valueStyle={{ color: financialMetrics.currentRatio > 1 ? '#3f8600' : '#cf1322' }}
          />
        </Space>
      </Drawer>

      <Modal
        title="Edit Transaction"
        visible={editModalVisible}
        onCancel={() => {
          setEditModalVisible(false);
          setEditingTransaction(null);
        }}
        footer={null}
      >
        {editingTransaction && (
          <Form
            layout="vertical"
            onFinish={handleEditSubmit}
            initialValues={{
              ...editingTransaction,
              date: moment(editingTransaction.date),
            }}
          >
            <Form.Item
              name="date"
              label="Date"
              rules={[{ required: true, message: 'Please select the date' }]}
            >
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item
              name="category"
              label="Category"
              rules={[{ required: true, message: 'Please select the category' }]}
            >
              <Select placeholder="Select category">
                {editingTransaction.amount >= 0
                  ? incomeCategories.map((category) => (
                      <Option key={category} value={category}>
                        {category}
                      </Option>
                    ))
                  : expenseCategories.map((category) => (
                      <Option key={category} value={category}>
                        {category}
                      </Option>
                    ))}
              </Select>
            </Form.Item>
            <Form.Item name="description" label="Description">
              <Input placeholder="Enter description" />
            </Form.Item>
            <Form.Item
              name="amount"
              label="Amount"
              rules={[{ required: true, message: 'Please enter the amount' }]}
            >
              <Input
                type="number"
                placeholder="Enter amount"
                step="0.01"
                addonBefore={editingTransaction.amount >= 0 ? '+' : '-'}
              />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                Update Transaction
              </Button>
            </Form.Item>
          </Form>
        )}
      </Modal>
    </StyledLayout>
  );
};

export default AccountingDashboard;