const titleCase = (s: string): string => {
  return s.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

const formatDate = (date: Date): string => {
  const options: any = { month: 'short', day: '2-digit', year: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}

export {
  titleCase,
  formatDate
}