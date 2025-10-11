import React, { useEffect } from 'react';
import { useAppState } from '../../store/useAppState';
import { TaskStatus, ProjectStatus, PaymentStatus } from '../../types';
import { format } from 'date-fns';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend } from 'recharts'; 
import { DollarSign, Clock, ListChecks, Bell, CalendarCheck, FileText, BarChart3 } from 'lucide-react';

interface ProjectDashboardProps {
    projectId: string;
}

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

// --- Main Component ---
const ProjectDashboard: React.FC<ProjectDashboardProps> = ({ projectId }) => {
    const { projects, tasks, invoices, expenses, setFilter } = useAppState();
    
    // Set the filter state globally when the component loads
    useEffect(() => {
        setFilter({ projectId: projectId });
        return () => setFilter({ projectId: null }); 
    }, [projectId, setFilter]);
    
    // --- Data Filtering ---
    const project = projects.find(p => p.id === projectId);
    const projectTasks = tasks.filter(t => t.projectId === projectId);
    const projectInvoices = invoices.filter(inv => inv.projectId === projectId);
    const projectExpenses = expenses.filter(exp => exp.projectId === projectId);

    if (!project) return <div className="text-red-500">Error: Project not found.</div>;


    // --- Project-Specific Calculations ---
    const totalProjectTasks = projectTasks.length;
    const completedProjectTasks = projectTasks.filter(t => t.status === TaskStatus.Done).length;
    const projectProgress = totalProjectTasks > 0 ? Math.round((completedProjectTasks / totalProjectTasks) * 100) : 0;
    
    const projectOverdueTasks = projectTasks.filter(t => t.status !== TaskStatus.Done && t.dueDate < new Date()).length;
    
    const projectTotalInvoiced = projectInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
    const projectTotalPaid = projectInvoices.reduce((sum, inv) => sum + inv.amountPaid, 0);
    const projectTotalDue = projectTotalInvoiced - projectTotalPaid;


    // --- Chart Data ---
    const TASK_PIE_COLORS = ['#3b82f6', '#f59e0b', '#6b7280', '#10b981']; 
    const taskOverviewData = Object.values(TaskStatus).map((status, index) => ({
        name: status,
        value: projectTasks.filter(t => t.status === status).length,
        color: TASK_PIE_COLORS[index] || '#6b7280'
    })).filter(d => d.value > 0);

    const invoiceStatusData = [
        { name: 'Overdue', value: projectInvoices.filter(inv => inv.status === PaymentStatus.Overdue).length, color: '#ef4444' },
        { name: 'Partial', value: projectInvoices.filter(inv => inv.status === PaymentStatus.Partial).length, color: '#f59e0b' },
        { name: 'Fully Paid', value: projectInvoices.filter(inv => inv.status === PaymentStatus.FullyPaid).length, color: '#10b981' },
        { name: 'Not Paid', value: projectInvoices.filter(inv => inv.status === PaymentStatus.NotPaid).length, color: '#6b7280' },
    ];
    
    const incomeExpenseData = [
        { name: 'Income', value: projectTotalPaid, color: '#3b82f6' },
        { name: 'Expenses', value: projectExpenses.reduce((sum, exp) => sum + exp.amount, 0), color: '#ef4444' }
    ];

    const activityData = [
        { name: 'Jan', Added: 2, Completed: 1 },
        { name: 'Feb', Added: 4, Completed: 2 },
        { name: 'Mar', Added: 1, Completed: 0 },
        { name: 'Apr', Added: 5, Completed: 3 },
    ];


    // --- Filtered Task Lists ---
    const upcomingTasks = projectTasks.filter(t => t.status !== TaskStatus.Done && t.startDate > new Date() && t.startDate < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)).sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
    const continuingTasks = projectTasks.filter(t => t.status === TaskStatus.InProgress).sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());
    const unmetDeadlines = projectTasks.filter(t => t.status !== TaskStatus.Done && t.dueDate < new Date()).sort((a, b) => b.dueDate.getTime() - a.dueDate.getTime());


    return (
        <div className="space-y-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Project Dashboard</h2>
            
            {/* ROW 1: STAT CARDS (Simplified for Project Context) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Tasks" value={totalProjectTasks} icon={<ListChecks />} color="blue" />
                <StatCard title="Overdue Tasks" value={projectOverdueTasks} icon={<Bell />} color="red" />
                <StatCard title="Total Invoiced" value={`$${projectTotalInvoiced.toFixed(2)}`} icon={<FileText />} color="yellow" />
                <StatCard title="Total Due" value={`$${projectTotalDue.toFixed(2)}`} icon={<DollarSign />} color="emerald" />
            </div>

            {/* ROW 2: PROJECT OVERVIEW (Task Stats), INVOICE OVERVIEW, INCOME/EXPENSE */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* 1. Project Overview (Task Stats) */}
                <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl shadow-lg">
                    <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Task Progression</h3>
                    
                    <div className="flex justify-around text-center border-b pb-4 mb-4 border-gray-200 dark:border-zinc-700">
                        <div><p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{projectTasks.filter(t => t.status === TaskStatus.Todo || t.status === TaskStatus.InProgress).length}</p><p className="text-sm text-gray-500 dark:text-gray-400">Open</p></div>
                        <div><p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{completedProjectTasks}</p><p className="text-sm text-gray-500 dark:text-gray-400">Completed</p></div>
                        <div><p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{projectTasks.filter(t => t.status === TaskStatus.Review).length}</p><p className="text-sm text-gray-500 dark:text-gray-400">Review</p></div>
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

                    {/* Reminders Section */}
                    <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-zinc-700">
                        <div>
                            <p className="text-3xl font-bold text-red-500 dark:text-red-400">0</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Reminder Today</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-medium text-gray-800 dark:text-gray-200 flex items-center space-x-1">
                                <CalendarCheck className="h-4 w-4 text-primary-accent" />
                                <span>Next Deadline</span>
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{unmetDeadlines.length > 0 ? format(unmetDeadlines[0].dueDate, 'MMM dd') : 'No upcoming'}</p>
                        </div>
                    </div>
                </div>

                {/* 2. Project Task Status Doughnut */}
                <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl shadow-lg h-96">
                    <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Task Status Overview</h3>
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

                {/* 3. Project Invoice Overview */}
                <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl shadow-lg">
                    <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Invoice Overview</h3>
                    
                    {invoiceStatusData.map((data) => (
                        <div key={data.name} className="flex justify-between items-center py-1">
                            <div className="flex items-center space-x-2">
                                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: data.color }}></span>
                                <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{data.name}</span>
                            </div>
                            <span className="text-sm font-semibold text-gray-900 dark:text-white">{projectInvoices.filter(inv => inv.status === data.name).length}</span>
                        </div>
                    ))}
                    
                    <div className="mt-6 pt-4 border-t border-gray-200 dark:border-zinc-700 space-y-1">
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Total Invoiced: <span className="float-right font-bold text-primary-accent">${projectTotalInvoiced.toFixed(2)}</span></p>
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Total Due: <span className="float-right font-bold text-red-500 dark:text-red-400">${projectTotalDue.toFixed(2)}</span></p>
                    </div>

                    {/* Placeholder for small graph */}
                    <div className="h-20 mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={activityData}>
                                <Tooltip contentStyle={{ backgroundColor: 'rgb(24 24 27)', border: 'none' }} />
                                <Line type="monotone" dataKey="Added" stroke="#3b82f6" dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* ROW 3: TASK LISTS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

            {/* ROW 4: TASK ACTIVITY LINE GRAPH */}
            <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl shadow-lg">
                <h3 className="text-lg font-semibold mb-6 text-gray-800 dark:text-white">Task Activity (Last 30 Days)</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={activityData}>
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

export default ProjectDashboard;