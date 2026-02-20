import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Share2 } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { BlogPost } from './Blog';

export default function BlogDetail() {
    const { id } = useParams();
    const [post, setPost] = useState<BlogPost | null>(null);

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem('px_blog_posts') || '[]');
        const found = stored.find((p: BlogPost) => p.id === id);
        if (found) setPost(found);
    }, [id]);

    if (!post) {
        return (
            <div className="min-h-screen flex flex-col">
                <Header />
                <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
                    <h2 className="text-2xl font-bold mb-4">존재하지 않는 글입니다</h2>
                    <Link to="/blog" className="text-accent hover:underline">목록으로 돌아가기</Link>
                </div>
                <Footer />
            </div>
        );
    }

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({ title: post.title, url: window.location.href });
            } catch (e) {
                // user aborted
            }
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert('링크가 복사되었습니다!');
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 bg-background py-8 md:py-12">
                <div className="container mx-auto px-4 max-w-3xl">
                    <Link to="/blog" className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-accent mb-8 text-sm font-medium transition-colors">
                        <ArrowLeft className="w-4 h-4" /> 목록으로 돌아가기
                    </Link>

                    <article className="bg-card border border-border rounded-xl overflow-hidden p-6 md:p-10 shadow-sm">
                        <p className="inline-block px-3 py-1 bg-muted rounded-full text-accent font-semibold text-xs mb-5">
                            {new Date(post.createdAt).toLocaleDateString()}
                        </p>
                        <h1 className="text-2xl md:text-4xl font-extrabold text-foreground mb-6 leading-tight break-keep">{post.title}</h1>

                        <div className="flex items-center justify-end gap-2 mb-8 pb-8 border-b border-border">
                            <button onClick={handleShare} className="flex items-center gap-1.5 px-4 py-2 bg-muted rounded-md text-sm font-medium text-foreground hover:bg-muted/80 transition-colors">
                                <Share2 className="w-4 h-4" /> 링크 공유
                            </button>
                        </div>

                        {post.imageUrl && (
                            <div className="mb-10 rounded-xl overflow-hidden bg-muted">
                                <img src={post.imageUrl} alt={post.title} className="w-full h-auto object-cover" />
                            </div>
                        )}

                        <div className="prose prose-p:text-foreground prose-headings:text-foreground prose-a:text-accent prose-strong:text-foreground max-w-none whitespace-pre-wrap leading-loose text-base md:text-lg opacity-90">
                            {post.content}
                        </div>
                    </article>
                </div>
            </main>
            <Footer />
        </div>
    );
}
