import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export interface BlogPost {
    id: string;
    title: string;
    excerpt: string;
    content: string;
    imageUrl?: string;
    createdAt: string;
}

const defaultPosts: BlogPost[] = [
    {
        id: '1',
        title: '2025년 파주시 산업/공단 개발 호재 완벽 정리',
        excerpt: '파주시 일대 새로운 산업단지 조성 및 접근성 개선을 위한 도로 확장 계획에 따른 투자 추천 지역을 안내합니다.',
        content: '부동산 투자의 핵심은 미래 가치입니다. 파주는 현재 다양한 산업 시설 확장이 이뤄지고 있습니다.\n\n최근 발표된 도로 정비 사업과 첨단 산업 유치 계획으로 인해, 특히 파주 북부권 및 자유로 인접 지역공단 부근의 가치가 크게 상승할 것으로 예상됩니다. 공장 이전을 고려 중인 사업주 분들은 이러한 인프라 개선을 눈여겨보아야 합니다.\n\n세금 감면 혜택 등도 새롭게 공고된 바 있으니, 구체적인 내용은 전화 미팅이나 방문 상담 시 자세히 안내해 드리겠습니다.',
        createdAt: new Date().toISOString(),
    }
];

export default function Blog() {
    const [posts, setPosts] = useState<BlogPost[]>([]);

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem('px_blog_posts') || 'null');
        if (!stored || stored.length === 0) {
            setPosts(defaultPosts);
            localStorage.setItem('px_blog_posts', JSON.stringify(defaultPosts));
        } else {
            setPosts(stored);
        }
    }, []);

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 bg-background py-10 md:py-16">
                <div className="container mx-auto px-4 max-w-5xl">
                    <div className="mb-10 text-center md:text-left">
                        <h1 className="text-3xl md:text-4xl font-bold text-foreground">부동산 소식</h1>
                        <p className="text-muted-foreground mt-3">토지, 공장, 창고 관련 최신 지역 정보와 세금/법규 상식을 전해드립니다.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {posts.map(post => (
                            <Link key={post.id} to={`/blog/${post.id}`} className="block group h-full">
                                <div className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-xl transition-all h-full flex flex-col hover:border-accent">
                                    <div className="aspect-[4/3] bg-muted relative overflow-hidden flex-shrink-0">
                                        {post.imageUrl ? (
                                            <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-5xl group-hover:scale-110 transition-transform duration-500">📰</div>
                                        )}
                                    </div>
                                    <div className="p-5 flex flex-col flex-1">
                                        <p className="text-xs text-accent font-medium mb-2">{new Date(post.createdAt).toLocaleDateString()}</p>
                                        <h2 className="text-lg font-bold text-foreground mb-3 line-clamp-2 group-hover:text-accent transition-colors">{post.title}</h2>
                                        <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed mt-auto">{post.excerpt}</p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
