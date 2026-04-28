import axios from '@/lib/axios';
import type { PaginatedResponse, Report } from '@/types';

export const getReports = async (): Promise<PaginatedResponse<Report>> => {
    const { data } = await axios.get('/api/reports');
    return data;
};
