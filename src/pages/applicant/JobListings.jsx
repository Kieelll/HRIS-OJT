import { useState } from 'react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import { mockJobListings } from '../../mockData'
import { useApplicantProfile } from '../../contexts/ApplicantProfileContext'
import Badge from '../../components/common/Badge'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import Select from '../../components/common/Select'

const JobListings = () => {
  const [jobs] = useState(mockJobListings)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterDepartment, setFilterDepartment] = useState('all')
  const [filterType, setFilterType] = useState('all')
  const [filterLocation, setFilterLocation] = useState('all')
  const { profile, getCompletionPercentage } = useApplicantProfile()
  const completionPercentage = getCompletionPercentage()

  const navItems = [
    { path: '/applicant/jobs', label: 'Job Listings', icon: 'briefcase' },
    { path: '/applicant/applications', label: 'My Applications', icon: 'document' },
    { path: '/applicant/onboarding', label: 'Onboarding Progress', icon: 'checkmark' },
    { path: '/applicant/profile', label: 'My Profile', icon: 'person' },
  ]

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartment = filterDepartment === 'all' || job.department === filterDepartment
    const matchesType = filterType === 'all' || job.employmentType === filterType
    const matchesLocation = filterLocation === 'all' || job.location === filterLocation
    return matchesSearch && matchesDepartment && matchesType && matchesLocation
  })

  const departments = [...new Set(jobs.map((j) => j.department))]
  const locations = [...new Set(jobs.map((j) => j.location))]

  return (
    <DashboardLayout navItems={navItems}>
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">Job Listings</h2>
            <p className="text-gray-600 mt-1">Browse available positions and apply</p>
          </div>
          {completionPercentage < 100 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md">
              <div className="flex items-start">
                <span className="text-xl mr-2">💡</span>
                <div>
                  <p className="text-sm font-medium text-gray-800 mb-1">
                    Profile {completionPercentage}% complete
                  </p>
                  <p className="text-xs text-gray-600 mb-2">
                    Complete your profile to auto-fill applications faster. You can apply anytime!
                  </p>
                  <Link to="/applicant/profile">
                    <Button variant="primary" size="sm">
                      Update Profile
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-4 card-elevation">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input
              placeholder="Search jobs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Select
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              options={[
                { value: 'all', label: 'All Departments' },
                ...departments.map((dept) => ({ value: dept, label: dept })),
              ]}
            />
            <Select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              options={[
                { value: 'all', label: 'All Types' },
                { value: 'Full-time', label: 'Full-time' },
                { value: 'Part-time', label: 'Part-time' },
                { value: 'Contract', label: 'Contract' },
                { value: 'Internship', label: 'Internship' },
              ]}
            />
            <Select
              value={filterLocation}
              onChange={(e) => setFilterLocation(e.target.value)}
              options={[
                { value: 'all', label: 'All Locations' },
                ...locations.map((loc) => ({ value: loc, label: loc })),
              ]}
            />
          </div>
        </div>

        {/* Job Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.length === 0 ? (
            <div className="col-span-full">
              <div className="bg-white rounded-xl p-12 card-elevation">
                <div className="flex flex-col items-center justify-center text-center">
                  <div className="text-6xl mb-4">💼</div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">No Jobs Found</h3>
                  <p className="text-gray-600 max-w-md mb-4">
                    No job listings match your current filters. Try adjusting your search criteria or check back later for new opportunities.
                  </p>
                  <Button variant="outline" onClick={() => {
                    setSearchTerm('')
                    setFilterDepartment('all')
                    setFilterType('all')
                    setFilterLocation('all')
                  }}>
                    Clear Filters
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            filteredJobs.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-xl p-6 card-elevation-hover transition-smooth"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{job.title}</h3>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="default">{job.department}</Badge>
                      <Badge variant="info">{job.employmentType}</Badge>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">{job.description}</p>
                <div className="space-y-2 mb-4">
                  <p className="text-sm text-gray-500">
                    <span className="font-medium">Location:</span> {job.location}
                  </p>
                  <p className="text-sm text-gray-500">
                    <span className="font-medium">Posted:</span> {job.postedDate}
                  </p>
                </div>
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Requirements:</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {job.requirements.slice(0, 3).map((req, idx) => (
                      <li key={idx}>• {req}</li>
                    ))}
                  </ul>
                </div>
                <Link to={`/applicant/apply/${job.id}`}>
                  <Button variant="primary" className="w-full">
                    Apply Now
                  </Button>
                </Link>
              </div>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}

export default JobListings

