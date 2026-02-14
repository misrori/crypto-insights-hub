import { VideoSummary } from '@/types/video';

const REPO_OWNER = 'misrori';
const REPO_NAME = 'daily_news';
const API_URL = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/data`;

interface GitHubContent {
    name: string;
    path: string;
    sha: string;
    size: number;
    url: string;
    html_url: string;
    git_url: string;
    download_url: string | null;
    type: 'file' | 'dir';
}

export const fetchDateFolders = async (): Promise<string[]> => {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Failed to fetch data directory');

        const contents: GitHubContent[] = await response.json();
        return contents
            .filter(item => item.type === 'dir' && item.name.match(/^\d{4}-\d{2}-\d{2}$/))
            .filter(item => item.name >= '2026-02-10')
            .map(item => item.name)
            .sort((a, b) => b.localeCompare(a));
    } catch (error) {
        console.error('Error fetching date folders:', error);
        return [];
    }
};

export const fetchVideosForDate = async (date: string): Promise<VideoSummary[]> => {
    try {
        const response = await fetch(`${API_URL}/${date}`);
        if (!response.ok) return [];

        const files: GitHubContent[] = await response.json();
        const jsonFiles = files.filter(file => file.name.endsWith('.json'));

        const videoPromises = jsonFiles.map(async (file) => {
            const videoResponse = await fetch(file.download_url!);
            if (!videoResponse.ok) return null;
            const data: VideoSummary = await videoResponse.json();

            // Fix URL if it's the object string bug
            if (data.url && typeof data.url === 'string' && data.url.includes('{\'kind\'')) {
                data.url = `https://www.youtube.com/watch?v=${data.video_id}`;
            }

            return data;
        });

        const dayVideos = await Promise.all(videoPromises);
        return dayVideos.filter((v): v is VideoSummary => v !== null);
    } catch (error) {
        console.error(`Error fetching videos for date ${date}:`, error);
        return [];
    }
};

/**
 * Legacy/Alternative way to fetch all videos (use incremental loading instead for better performance)
 */
export const fetchVideos = async (): Promise<VideoSummary[]> => {
    try {
        const dateFolders = await fetchDateFolders();
        const allVideos: VideoSummary[] = [];

        for (const folder of dateFolders) {
            const dayVideos = await fetchVideosForDate(folder);
            allVideos.push(...dayVideos);
        }

        return allVideos;
    } catch (error) {
        console.error('Error fetching all videos:', error);
        return [];
    }
};
