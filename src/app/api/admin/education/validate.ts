// Validation utility for Education
export function validateEducationFields(body: Record<string, unknown>): string[] {
  const errors: string[] = [];

  if (!body.institution || typeof body.institution !== 'string' || body.institution.trim() === '') {
    errors.push('Institution is required and must be a non-empty string.');
  }
  if (!body.degree || typeof body.degree !== 'string' || body.degree.trim() === '') {
    errors.push('Degree is required and must be a non-empty string.');
  }
  if ('fieldOfStudy' in body && body.fieldOfStudy !== undefined && body.fieldOfStudy !== null && typeof body.fieldOfStudy !== 'string') {
    errors.push('fieldOfStudy must be a string.');
  }
  if (!body.startDate || typeof body.startDate !== 'string' || isNaN(Date.parse(body.startDate))) {
    errors.push('startDate is required and must be a valid date.');
  }
  if ('endDate' in body && body.endDate && (typeof body.endDate !== 'string' || isNaN(Date.parse(body.endDate)))) {
    errors.push('endDate must be a valid date if provided.');
  }
  if ('currentlyStudying' in body && typeof body.currentlyStudying !== 'boolean') {
    errors.push('currentlyStudying must be a boolean.');
  }
  if ('gradeOrPercentage' in body && body.gradeOrPercentage !== undefined && body.gradeOrPercentage !== null && typeof body.gradeOrPercentage !== 'string') {
    errors.push('gradeOrPercentage must be a string.');
  }
  if ('description' in body && body.description !== undefined && body.description !== null) {
    if (!Array.isArray(body.description) || !body.description.every((item) => typeof item === 'string')) {
      errors.push('description must be an array of strings.');
    }
  }
  if ('location' in body && body.location !== undefined && body.location !== null && typeof body.location !== 'string') {
    errors.push('location must be a string.');
  }

  return errors;
}
