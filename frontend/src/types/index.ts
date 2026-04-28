export interface User {
    id: number;
    name: string;
    email: string;
    role: 'user' | 'instansi';
    kode_wilayah?: string;
    avatar?: string;
}

export interface Instansi {
    id: number;
    nama_instansi: string;
    kategori_tanggung_jawab: string;
    user_id: number;
}

export interface ReportMedia {
    id: number;
    report_id: number;
    file_path: string;
    file_type: string;
}

export interface Comment {
    id: number;
    report_id: number;
    user_id: number;
    content: string;
    user?: User;
}

export interface Report {
    id: number;
    user_id: number;
    judul: string;
    deskripsi: string;
    kategori: string;
    lokasi: string;
    latitude?: number;
    longitude?: number;
    status: string;
    is_anonymous: boolean;
    upvotes_count: number;
    created_at: string;
    updated_at: string;
    
    // Relationships
    user?: User;
    instansi?: Instansi;
    media?: ReportMedia[];
    comments?: Comment[];
}

export interface PaginatedResponse<T> {
    current_page: number;
    data: T[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: { url: string | null; label: string; active: boolean }[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
}
