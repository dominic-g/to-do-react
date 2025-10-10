/* @tailwind safelist border-blue-500 border-yellow-500 border-red-500 border-emerald-500 
   bg-blue-100 bg-yellow-100 bg-red-100 bg-emerald-100
   dark:bg-blue-900 dark:bg-yellow-900 dark:bg-red-900 dark:bg-emerald-900
   text-blue-500 text-yellow-500 text-red-500 text-emerald-500
   dark:text-blue-300 dark:text-yellow-300 dark:text-red-300 dark:text-emerald-300
*/

import React from 'react';
import { useAppState } from '../store/useAppState';
import { TaskStatus, TaskType, PaymentStatus, TicketStatus, ProjectStatus } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend } from 'recharts'; 
import { format } from 'date-fns';
import { DollarSign, Clock, ListChecks, Ticket, Bell, CalendarCheck, Plus } from 'lucide-react';

const GlobalDashboard: React.FC = () => {
  const { projects, tasks, invoices, expenses, tickets } = useAppState();

  const overdueTasks = tasks.filter(t => t.status !== TaskStatus.Done && t.dueDate < new Date()).length;
  const activeTasks = tasks.filter(t => t.status !== TaskStatus.Done).length;
  const completedTasks = tasks.filter(t => t.status === TaskStatus.Done).length;
  const totalInvoiced = invoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
  const totalPaid = invoices.reduce((sum, inv) => sum + inv.amountPaid, 0);
  const totalDue = totalInvoiced - totalPaid;
  const overdueInvoices = invoices.filter(inv => inv.status === PaymentStatus.Overdue).length;
  const totalExpense = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const totalIncome = totalPaid; 
  
  // Project Progression (Simple Calculation)
  const totalProjectTasks = tasks.length;
  const completedProjectTasks = tasks.filter(t => t.status === TaskStatus.Done).length;
  const projectProgress = totalProjectTasks > 0 ? Math.round((completedProjectTasks / totalProjectTasks) * 100) : 0;


  // Chart Data
  const invoiceStatusData = [
    { name: 'Overdue', value: overdueInvoices, color: '#ef4444' },
    { name: 'Partial', value: invoices.filter(inv => inv.status === PaymentStatus.Partial).length, color: '#f59e0b' },
    { name: 'Fully Paid', value: invoices.filter(inv => inv.status === PaymentStatus.FullyPaid).length, color: '#10b981' },
    { name: 'Not Paid', value: invoices.filter(inv => inv.status === PaymentStatus.NotPaid).length, color: '#6b7280' },
  ];
  const TASK_PIE_COLORS = ['#3b82f6', '#f59e0b', '#6b7280', '#10b981']; 
  const taskOverviewData = Object.values(TaskStatus).map((status, index) => ({
    name: status,
    value: tasks.filter(t => t.status === status).length,
    color: TASK_PIE_COLORS[index] || '#6b7280'
  })).filter(d => d.value > 0);



  const taskStatusData = [
    { name: 'Completed', value: completedTasks, color: '#10b981' }, // emerald-500
    { name: 'Active', value: activeTasks, color: '#3b82f6' },      // blue-500
  ];

  const PIE_COLORS = ['#ef4444', '#f59e0b', '#10b981', '#6b7280'];

  const lineGraphData = [
    { name: 'Oct 1', Added: 5, Completed: 2 },
    { name: 'Oct 2', Added: 8, Completed: 4 },
    { name: 'Oct 3', Added: 3, Completed: 1 },
    // ... Real data processing will be complex, using placeholder for now.
  ];


  const tasksDueSoon = tasks
    .filter(t => t.status !== TaskStatus.Done && t.dueDate > new Date() && t.dueDate < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000))
    .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());

  const unfinishedTasks = tasks
    .filter(t => t.status !== TaskStatus.Done)
    .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());


  // --- Helper Component for Task Lists ---
  const TaskListItem: React.FC<{ task: typeof tasks[0] }> = ({ task }) => (
    <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-zinc-700 last:border-b-0">
      <span className="font-medium text-gray-800 dark:text-gray-200 truncate">{task.title}</span>
      <span className={`text-sm font-semibold ${task.dueDate < new Date() ? 'text-red-500 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'}`}>
        {format(task.dueDate, 'MMM dd, h:mm a')}
      </span>
    </div>
  );


  // Income vs Expense
  const incomeExpenseData = [
    { name: 'Income', value: totalIncome, color: '#3b82f6' },
    { name: 'Expenses', value: totalExpense, color: '#ef4444' }
  ];


  // Simple line graph data (Placeholder for activity)
  const activityData = [
    { name: 'Jan', Income: 3000, Expenses: 1200 },
    { name: 'Feb', Income: 4500, Expenses: 1500 },
    { name: 'Mar', Income: 2000, Expenses: 800 },
    { name: 'Apr', Income: 5000, Expenses: 2200 },
    { name: 'May', Income: 6000, Expenses: 1800 },
    { name: 'Jun', Income: 4200, Expenses: 1000 },
    { name: 'Jul', Income: 3500, Expenses: 900 },
    { name: 'Aug', Income: 5500, Expenses: 1300 },
  ];
  
  // --- Helper Components ---
  const StatCard: React.FC<{ title: string, value: string | number, icon: React.ReactNode, color: string }> = ({ title, value, icon, color }) => (
    <div className={`flex items-center p-4 rounded-xl shadow-lg bg-white dark:bg-zinc-800 border-l-4 border-${color}-500`}>
      <div className={`p-3 rounded-full bg-${color}-100 dark:bg-${color}-900 text-${color}-500 dark:text-${color}-300 mr-4`}>
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
        <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
      </div>
    </div>
  );
  
  const ListCard: React.FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl shadow-lg h-full">
        <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">{title}</h3>
        <div className="space-y-2 max-h-64 overflow-y-auto">
            {children}
        </div>
    </div>
  );

  const TaskListCard: React.FC<{ title: string, tasks: typeof tasks }> = ({ title, tasks }) => (
    <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl shadow-lg h-full">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">{title}</h3>
        <div className="space-y-2 max-h-64 overflow-y-auto">
            {tasks.length > 0 ? (
                tasks.map(task => (
                    <div key={task.id} className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-zinc-700 last:border-b-0">
                        <span className="font-medium text-gray-800 dark:text-gray-200 truncate">{task.title}</span>
                        <span className={`text-sm font-semibold ${task.dueDate < new Date() ? 'text-red-500 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'}`}>
                            {format(task.dueDate, 'MMM dd')}
                        </span>
                    </div>
                ))
            ) : (
                <p className="text-gray-500 dark:text-gray-400 mt-2">No tasks in this category.</p>
            )}
        </div>
    </div>
  );



  // --- Filtered Task Lists (based on status and deadline) ---
  const upcomingTasks = tasks.filter(t => t.status !== TaskStatus.Done && t.startDate > new Date() && t.startDate < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)).sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
  const continuingTasks = tasks.filter(t => t.status === TaskStatus.InProgress).sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());
  const unmetDeadlines = tasks.filter(t => t.status !== TaskStatus.Done && t.dueDate < new Date()).sort((a, b) => b.dueDate.getTime() - a.dueDate.getTime());


  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Global Dashboard</h1>
      

      {/* ROW 1: STAT CARDS (RISE STYLE) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Projects" value={projects.length} icon={<ListChecks />} color="blue" />
        <StatCard title="Active Tasks" value={tasks.filter(t => t.status !== TaskStatus.Done).length} icon={<Clock />} color="yellow" />
        <StatCard title="Overdue Tasks" value={unmetDeadlines.length} icon={<Bell />} color="red" />
        <StatCard title="Total Due" value={`$${totalDue.toFixed(2)}`} icon={<DollarSign />} color="emerald" />
      </div>

      {/* ROW 2: PROJECT OVERVIEW & INVOICE / EXPENSE CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* COLUMN 1: Projects Overview (RISE STYLE) */}
        <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Projects Overview</h3>
            
            <div className="flex justify-around text-center border-b pb-4 mb-4 border-gray-200 dark:border-zinc-700">
                <div><p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{projects.filter(p => p.status === ProjectStatus.Active).length}</p><p className="text-sm text-gray-500 dark:text-gray-400">Open</p></div>
                <div><p className="text-3xl font-bold text-red-600 dark:text-red-400">{projects.filter(p => p.status === ProjectStatus.Complete).length}</p><p className="text-sm text-gray-500 dark:text-gray-400">Completed</p></div>
                <div><p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{projects.filter(p => p.status === ProjectStatus.Archived).length}</p><p className="text-sm text-gray-500 dark:text-gray-400">Hold</p></div>
            </div>

            {/* Progression Bar */}
            <div className="mt-4 mb-6">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Progression {projectProgress}%</p>
                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-zinc-700">
                    <div 
                        className="h-2.5 rounded-full bg-emerald-500 transition-all duration-500" 
                        style={{ width: `${projectProgress}%` }}
                    />
                </div>
            </div>

            {/* Reminders Section (RISE STYLE) */}
            <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-zinc-700">
                <div>
                    <p className="text-3xl font-bold text-red-500 dark:text-red-400">0</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Reminder Today</p>
                </div>
                <div className="text-right">
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200 flex items-center space-x-1">
                        <CalendarCheck className="h-4 w-4 text-primary-accent" />
                        <span>Next Reminder</span>
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">No reminder</p>
                </div>
            </div>
        </div>


        {/* COLUMN 2: Invoice Overview (RISE STYLE) - The complex list/doughnut structure is replaced by a simpler overview here */}
        <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Invoice Overview</h3>
            
            {/* Simple list of statuses */}
            <div className="space-y-3">
                {invoiceStatusData.map((data) => (
                    <div key={data.name} className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: data.color }}></span>
                            <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{data.name}</span>
                        </div>
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">{data.value}</span>
                    </div>
                ))}
            </div>

            {/* Total/Due Footer */}
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-zinc-700 space-y-1">
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Total Invoiced: <span className="float-right font-bold text-primary-accent">${totalInvoiced.toFixed(2)}</span></p>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Due: <span className="float-right font-bold text-red-500 dark:text-red-400">${totalDue.toFixed(2)}</span></p>
            </div>

            {/* Small Line Graph (Placeholder for Last 12 months) */}
            <div className="h-20 mt-4">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={activityData}>
                        <Tooltip contentStyle={{ backgroundColor: 'rgb(24 24 27)', border: 'none' }} />
                        <Line type="monotone" dataKey="Income" stroke="#3b82f6" dot={false} />
                    </LineChart>
                </ResponsiveContainer>
            </div>

        </div>

       </div>
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6"> 

        
        {/* COLUMN 1: All Tasks Overview (DOUGHNUT - RISE STYLE) */}
        <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl shadow-lg h-96">
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">All Tasks Overview</h3>
            <ResponsiveContainer width="100%" height="80%">
                <PieChart>
                    <Pie
                        data={taskOverviewData}
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={5}
                        dataKey="value"
                        nameKey="name"
                    >
                        {taskOverviewData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: 'rgb(24 24 27)', border: 'none' }} />
                    <Legend iconType="circle" layout="vertical" align="right" verticalAlign="middle" />
                </PieChart>
            </ResponsiveContainer>
        </div>
        {/* COLUMN 2: Income vs Expenses (RISE STYLE) */}
        <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Income vs Expenses</h3>
            
            <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                    <Pie
                        data={incomeExpenseData}
                        innerRadius={70}
                        outerRadius={100}
                        paddingAngle={0}
                        dataKey="value"
                        nameKey="name"
                    >
                        {incomeExpenseData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: 'rgb(24 24 27)', border: 'none' }} />
                </PieChart>
            </ResponsiveContainer>
            
            {/* Breakdown List (RISE STYLE) */}
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-zinc-700 space-y-2">
                <div className="flex justify-between items-center text-sm font-medium">
                    <div className="flex items-center space-x-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        <span className="text-gray-800 dark:text-gray-200">Income</span>
                    </div>
                    <span className="font-bold text-emerald-500">${totalIncome.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-sm font-medium">
                    <div className="flex items-center space-x-2">
                        <span className="w-2 h-2 rounded-full bg-red-500"></span>
                        <span className="text-gray-800 dark:text-gray-200">Expenses</span>
                    </div>
                    <span className="font-bold text-red-500">${totalExpense.toFixed(2)}</span>
                </div>
            </div>
        </div>
      </div>

      {/* ROW 3: TASK LISTS  */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        
        {/* COLUMNS 1, 2, 3: Filtered Task Lists (RISE STYLE) */}
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
            <ListCard title="Upcoming Start" >
                {upcomingTasks.length > 0 ? (
                    upcomingTasks.map(task => (
                        <div key={task.id} className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-zinc-700 last:border-b-0">
                            <span className="font-medium text-gray-800 dark:text-gray-200 truncate">{task.title}</span>
                            <span className={`text-sm font-semibold text-gray-600 dark:text-gray-400`}>
                                {format(task.startDate, 'MMM dd')}
                            </span>
                        </div>
                    ))
                ) : (<p className="text-gray-500 dark:text-gray-400 mt-2">No tasks starting soon.</p>)}
            </ListCard>
            <ListCard title="Continuing (In Progress)" >
                {continuingTasks.length > 0 ? (
                    continuingTasks.map(task => (
                        <div key={task.id} className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-zinc-700 last:border-b-0">
                            <span className="font-medium text-gray-800 dark:text-gray-200 truncate">{task.title}</span>
                            <span className={`text-sm font-semibold text-gray-600 dark:text-gray-400`}>
                                {format(task.dueDate, 'MMM dd')}
                            </span>
                        </div>
                    ))
                ) : (<p className="text-gray-500 dark:text-gray-400 mt-2">No active tasks.</p>)}
            </ListCard>
            <ListCard title="Unmet Deadlines" >
                {unmetDeadlines.length > 0 ? (
                    unmetDeadlines.map(task => (
                        <div key={task.id} className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-zinc-700 last:border-b-0">
                            <span className="font-medium text-gray-800 dark:text-gray-200 truncate">{task.title}</span>
                            <span className={`text-sm font-semibold text-red-500 dark:text-red-400`}>
                                {format(task.dueDate, 'MMM dd')}
                            </span>
                        </div>
                    ))
                ) : (<p className="text-gray-500 dark:text-gray-400 mt-2">All deadlines are current!</p>)}
            </ListCard>
        </div>
      </div>

      {/* ROW 4: TICKET STATUS */}
      <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Ticket Status</h3>
          <div className="grid grid-cols-4 text-center">
              {Object.values(TicketStatus).map(status => (
                  <div key={status} className="p-4 border-r last:border-r-0 border-gray-200 dark:border-zinc-700">
                      <p className="text-3xl font-bold text-primary-accent dark:text-sky-300">
                          {tickets.filter(t => t.status === status).length}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{status}</p>
                  </div>
              ))}
          </div>
      </div>

      
      {/* ROW 5: LINE GRAPH */}
      <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl shadow-lg">
        <h3 className="text-lg font-semibold mb-6 text-gray-800 dark:text-white">Task Activity (Last 30 Days)</h3>
        <ResponsiveContainer width="100%" height={300}>
            <LineChart data={lineGraphData}>
                <XAxis dataKey="name" stroke="#8884d8" />
                <YAxis stroke="#8884d8" />
                <Tooltip contentStyle={{ backgroundColor: 'rgb(24 24 27)', border: 'none' }} />
                <Legend />
                <Line type="monotone" dataKey="Added" stroke="#3b82f6" activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="Completed" stroke="#10b981" />
            </LineChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
};

export default GlobalDashboard;