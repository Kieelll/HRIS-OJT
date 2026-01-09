// Mock data for the HRIS application

export const mockJobRequests = [
  {
    id: 'JR-2024-001',
    position: 'Senior Software Engineer',
    department: 'Engineering',
    employmentType: 'Full-time',
    targetHireDate: '2024-03-15',
    actualOnboardingDate: null,
    status: 'pending',
    requestedBy: 'Mike Manager',
    requestedDate: '2024-01-10',
    approvals: {
      manager: { approved: true, date: '2024-01-11' },
      hr: { approved: false, date: null },
      director: { approved: false, date: null },
    },
  },
  {
    id: 'JR-2024-002',
    position: 'HR Analyst',
    department: 'Human Resources',
    employmentType: 'Full-time',
    targetHireDate: '2024-02-20',
    actualOnboardingDate: '2024-02-18',
    status: 'approved',
    requestedBy: 'Lisa HR Manager',
    requestedDate: '2024-01-05',
    approvals: {
      manager: { approved: true, date: '2024-01-06' },
      hr: { approved: true, date: '2024-01-07' },
      director: { approved: true, date: '2024-01-08' },
    },
  },
  {
    id: 'JR-2024-003',
    position: 'Product Designer',
    department: 'Product',
    employmentType: 'Full-time',
    targetHireDate: '2024-04-01',
    actualOnboardingDate: null,
    status: 'rejected',
    requestedBy: 'Mike Manager',
    requestedDate: '2024-01-15',
    approvals: {
      manager: { approved: true, date: '2024-01-16' },
      hr: { approved: false, date: null },
      director: { approved: false, date: null },
    },
  },
]

export const mockApplicants = [
  {
    id: 'APP-001',
    name: 'John Doe',
    email: 'john.doe@example.com',
    position: 'Senior Software Engineer',
    department: 'Engineering',
    status: 'screening',
    appliedDate: '2024-01-20',
    resumeUrl: '/mock-resume.pdf',
    qualifications: {
      education: true,
      experience: true,
      skills: true,
      certifications: false,
    },
  },
  {
    id: 'APP-002',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    position: 'HR Analyst',
    department: 'Human Resources',
    status: 'interview',
    appliedDate: '2024-01-18',
    resumeUrl: '/mock-resume.pdf',
    qualifications: {
      education: true,
      experience: true,
      skills: true,
      certifications: true,
    },
  },
  {
    id: 'APP-003',
    name: 'Bob Johnson',
    email: 'bob.johnson@example.com',
    position: 'Product Designer',
    department: 'Product',
    status: 'rejected',
    appliedDate: '2024-01-15',
    resumeUrl: '/mock-resume.pdf',
    qualifications: {
      education: true,
      experience: false,
      skills: true,
      certifications: false,
    },
  },
]

export const mockInterviews = [
  {
    id: 'INT-001',
    applicantId: 'APP-001',
    applicantName: 'John Doe',
    position: 'Senior Software Engineer',
    stage: 'initial',
    scheduledDate: '2024-02-05',
    scheduledTime: '10:00 AM',
    interviewers: ['Sarah HR Officer', 'Mike Manager'],
    status: 'scheduled',
    location: 'Conference Room A',
  },
  {
    id: 'INT-002',
    applicantId: 'APP-002',
    applicantName: 'Jane Smith',
    position: 'HR Analyst',
    stage: 'technical',
    scheduledDate: '2024-02-08',
    scheduledTime: '2:00 PM',
    interviewers: ['David HR Analyst', 'Lisa HR Manager'],
    status: 'completed',
    location: 'Conference Room B',
  },
  {
    id: 'INT-003',
    applicantId: 'APP-001',
    applicantName: 'John Doe',
    position: 'Senior Software Engineer',
    stage: 'final',
    scheduledDate: '2024-02-12',
    scheduledTime: '11:00 AM',
    interviewers: ['Robert HR Director', 'Mike Manager'],
    status: 'scheduled',
    location: 'Conference Room A',
  },
]

export const mockJobListings = [
  {
    id: 'JOB-001',
    title: 'Senior Software Engineer',
    department: 'Engineering',
    employmentType: 'Full-time',
    location: 'San Francisco, CA',
    postedDate: '2024-01-10',
    description: 'We are looking for an experienced software engineer...',
    requirements: ['5+ years experience', 'React, Node.js', 'BS in Computer Science'],
  },
  {
    id: 'JOB-002',
    title: 'HR Analyst',
    department: 'Human Resources',
    employmentType: 'Full-time',
    location: 'New York, NY',
    postedDate: '2024-01-05',
    description: 'Join our HR team to support talent management...',
    requirements: ['3+ years HR experience', 'Analytical skills', 'HR certification preferred'],
  },
  {
    id: 'JOB-003',
    title: 'Product Designer',
    department: 'Product',
    employmentType: 'Full-time',
    location: 'Remote',
    postedDate: '2024-01-15',
    description: 'Design beautiful and intuitive user experiences...',
    requirements: ['Portfolio required', 'Figma expertise', 'UX/UI experience'],
  },
]

export const mockEmployees = [
  {
    id: 'EMP-001',
    name: 'Jane Employee',
    email: 'jane.employee@company.com',
    department: 'Engineering',
    position: 'Software Engineer',
    hireDate: '2023-06-01',
    status: 'active',
  },
  {
    id: 'EMP-002',
    name: 'John Developer',
    email: 'john.developer@company.com',
    department: 'Engineering',
    position: 'Senior Developer',
    hireDate: '2022-03-15',
    status: 'active',
  },
]

export const mockAttendance = {
  totalDays: 22,
  presentDays: 20,
  absentDays: 1,
  leaveDays: 1,
  thisMonth: [
    { date: '2024-01-01', status: 'present' },
    { date: '2024-01-02', status: 'present' },
    { date: '2024-01-03', status: 'leave' },
    { date: '2024-01-04', status: 'present' },
  ],
}

export const mockPayroll = {
  currentMonth: 'January 2024',
  grossSalary: 7500,
  deductions: 1200,
  netSalary: 6300,
  payDate: '2024-01-31',
}

export const mockTrainings = [
  {
    id: 'TRN-001',
    title: 'React Advanced Patterns',
    category: 'Technical',
    duration: '8 hours',
    status: 'available',
    recommended: true,
  },
  {
    id: 'TRN-002',
    title: 'Leadership Skills',
    category: 'Soft Skills',
    duration: '4 hours',
    status: 'completed',
    recommended: false,
  },
]

export const mockOffboarding = [
  {
    id: 'OFF-001',
    employeeId: 'EMP-003',
    employeeName: 'Former Employee',
    department: 'Engineering',
    exitDate: '2024-02-15',
    status: 'in_progress',
    checklist: {
      equipmentReturn: false,
      accessRevoked: false,
      finalPay: false,
      exitInterview: false,
    },
  },
]

export const mockMetrics = {
  totalEmployees: 150,
  activeRecruitments: 12,
  pendingApprovals: 5,
  upcomingInterviews: 8,
  onboardingProgress: 3,
  attritionRate: 2.5,
  monthlyHires: 5,
}

// Enhanced onboarding mock data
export const mockOnboardingTasks = [
  {
    id: 'task-1',
    title: 'Complete I-9 Form',
    description: 'Employment eligibility verification form required by law',
    type: 'form_completion',
    status: 'pending',
    dueDate: '2024-02-20',
    priority: 'high',
    actionLabel: 'Start Form',
  },
  {
    id: 'task-2',
    title: 'Upload Government ID',
    description: 'Upload a copy of your driver\'s license or passport',
    type: 'document_upload',
    status: 'pending',
    dueDate: '2024-02-20',
    priority: 'high',
    actionLabel: 'Upload Document',
  },
  {
    id: 'task-3',
    title: 'Review Employee Handbook',
    description: 'Read and acknowledge company policies and procedures',
    type: 'acknowledgment',
    status: 'pending',
    dueDate: '2024-02-22',
    priority: 'medium',
    actionLabel: 'Review Handbook',
  },
  {
    id: 'task-4',
    title: 'Complete Tax Forms (W-4)',
    description: 'Federal and state tax withholding information',
    type: 'form_completion',
    status: 'pending',
    dueDate: '2024-02-21',
    priority: 'high',
    actionLabel: 'Complete Forms',
  },
  {
    id: 'task-5',
    title: 'Schedule Orientation Session',
    description: 'Book your orientation date and time',
    type: 'orientation',
    status: 'pending',
    dueDate: '2024-02-25',
    priority: 'medium',
    actionLabel: 'Schedule',
  },
  {
    id: 'task-6',
    title: 'Set Up Direct Deposit',
    description: 'Provide banking information for payroll',
    type: 'form_completion',
    status: 'pending',
    dueDate: '2024-02-23',
    priority: 'medium',
    actionLabel: 'Add Bank Info',
  },
]

export const mockOnboardingDocuments = [
  {
    id: 'doc-1',
    name: 'I-9 Form',
    type: 'form',
    status: 'pending',
    uploadedAt: null,
    required: true,
  },
  {
    id: 'doc-2',
    name: 'Government ID',
    type: 'identification',
    status: 'pending',
    uploadedAt: null,
    required: true,
  },
  {
    id: 'doc-3',
    name: 'W-4 Tax Form',
    type: 'form',
    status: 'pending',
    uploadedAt: null,
    required: true,
  },
  {
    id: 'doc-4',
    name: 'Emergency Contact Form',
    type: 'form',
    status: 'pending',
    uploadedAt: null,
    required: false,
  },
]

