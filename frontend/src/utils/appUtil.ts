import isEmpty from 'lodash.isempty'

export const getCoefFromProject = (projectId, projects): number => {
  if (isEmpty(projects) || !projectId) {
    return 1
  }

  const project = projects.filter((project) => project.id == projectId)
  if (!project || isEmpty(project)) {
    return 1
  }

  return project[0].coef
}
