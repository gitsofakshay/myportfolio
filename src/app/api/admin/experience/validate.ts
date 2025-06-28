// Validation utility for Experience
export function validateExperienceFields(body: Record<string, unknown>): string[] {
  const errors: string[] = [];
  if (!body.title || typeof body.title !== 'string' || body.title.trim() === '') {
    errors.push('Title is required and must be a non-empty string.');
  }
  if (!body.company || typeof body.company !== 'string' || body.company.trim() === '') {
    errors.push('Company is required and must be a non-empty string.');
  }
  if ('location' in body && body.location !== undefined && body.location !== null && typeof body.location !== 'string') {
    errors.push('Location must be a string.');
  }
  if (!body.startDate || typeof body.startDate !== 'string' || isNaN(Date.parse(body.startDate))) {
    errors.push('startDate is required and must be a valid date.');
  }
  if ('endDate' in body && body.endDate && (typeof body.endDate !== 'string' || isNaN(Date.parse(body.endDate)))) {
    errors.push('endDate must be a valid date if provided.');
  }
  if ('currentlyWorking' in body && typeof body.currentlyWorking !== 'boolean') {
    errors.push('currentlyWorking must be a boolean.');
  }
  if ('description' in body && body.description !== undefined && body.description !== null) {
    if (!Array.isArray(body.description) || !body.description.every((item) => typeof item === 'string')) {
      errors.push('description must be an array of strings.');
    }
  }
  return errors;
}
