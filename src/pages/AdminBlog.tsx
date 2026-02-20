import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Pencil, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { BlogPost } from './Blog';

export default function AdminBlog() {
    const navigate = useNavigate();
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentPost, setCurrentPost] = useState<Partial<BlogPost>>({});

    useEffect(() => {
        if (!sessionStorage.getItem('admin_auth')) navigate('/admin');
        setPosts(JSON.parse(localStorage.getItem('px_blog_posts') || '[]'));
    }, []);

    const handleSave = () => {
        if (!currentPost.title || !currentPost.content) {
            toast({ title: '제목과 내용을 입력해주세요', variant: 'destructive' });
            return;
        }

        const excerpt = currentPost.excerpt || currentPost.content.slice(0, 100) + '...';

        let updated;
        if (currentPost.id) {
            // update
            updated = posts.map(p => p.id === currentPost.id ? { ...p, ...currentPost, excerpt } : p);
        } else {
            // create
            updated = [{
                ...currentPost,
                id: Date.now().toString(),
                createdAt: new Date().toISOString(),
                excerpt
            } as BlogPost, ...posts];
        }

        setPosts(updated);
        localStorage.setItem('px_blog_posts', JSON.stringify(updated));
        toast({ title: '블로그 게시물이 저장되었습니다' });
        setIsEditing(false);
        setCurrentPost({});
        navigate('/blog');
    };

    const handleDelete = (id: string) => {
        if (confirm('이 게시물을 정말 삭제하시겠습니까?')) {
            const updated = posts.filter(p => p.id !== id);
            setPosts(updated);
            localStorage.setItem('px_blog_posts', JSON.stringify(updated));
            toast({ title: '게시물이 삭제되었습니다' });
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setCurrentPost({ ...currentPost, imageUrl: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    if (isEditing) {
        return (
            <div className="min-h-screen bg-background">
                <div className="bg-primary px-4 py-4 flex items-center justify-between shadow">
                    <div className="flex items-center gap-3">
                        <span className="text-accent font-bold text-lg flex items-center gap-2">📝 소식 작성하기</span>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>취소</Button>
                </div>
                <div className="container mx-auto px-4 py-8 max-w-4xl">
                    <div className="bg-card border border-border p-6 rounded-2xl shadow-sm space-y-6">
                        <div>
                            <label className="text-sm font-semibold text-foreground block mb-2">게시물 제목</label>
                            <Input
                                value={currentPost.title || ''}
                                onChange={e => setCurrentPost({ ...currentPost, title: e.target.value })}
                                placeholder="관심을 끌 수 있는 제목을 입력하세요"
                                className="h-12"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-semibold text-foreground block mb-2">대표 이미지</label>
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                {currentPost.imageUrl && (
                                    <div className="relative group">
                                        <img src={currentPost.imageUrl} alt="preview" className="w-48 h-32 object-cover rounded-lg border border-border" />
                                        <button onClick={() => setCurrentPost({ ...currentPost, imageUrl: '' })} className="absolute top-2 right-2 p-1 bg-black/50 hover:bg-black text-white rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}
                                <div>
                                    <label className="cursor-pointer inline-flex items-center justify-center gap-2 px-6 py-3 border border-border rounded-lg bg-muted hover:bg-muted/80 text-sm font-medium transition-colors">
                                        <ImageIcon className="w-4 h-4 text-muted-foreground" /> {currentPost.imageUrl ? '이미지 변경하기' : '커버 이미지 첨부 (필수 아님)'}
                                        <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div>
                            <label className="text-sm font-semibold text-foreground block mb-2">짧은 요약 <span className="text-xs text-muted-foreground font-normal">(미입력 시 내용의 첫 100자가 사용됩니다)</span></label>
                            <Input
                                value={currentPost.excerpt || ''}
                                onChange={e => setCurrentPost({ ...currentPost, excerpt: e.target.value })}
                                placeholder="목록에서 보여질 짧은 소개글"
                                maxLength={150}
                            />
                        </div>
                        <div>
                            <label className="text-sm font-semibold text-foreground block mb-2">본문 내용</label>
                            <textarea
                                value={currentPost.content || ''}
                                onChange={e => setCurrentPost({ ...currentPost, content: e.target.value })}
                                placeholder="고객에게 알리고 싶은 세금, 법규, 지역 호재 등을 자유롭게 적어주세요."
                                className="w-full h-96 border border-border rounded-lg p-4 bg-background reset-none focus:outline-none focus:ring-2 focus:ring-accent leading-relaxed"
                            />
                        </div>
                        <div className="pt-4 flex justify-end">
                            <Button onClick={handleSave} className="w-full sm:w-auto px-10 h-12 bg-accent text-accent-foreground font-bold hover:bg-gold-dark text-lg shadow-md">
                                등록하기
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="bg-primary px-4 py-3 flex items-center justify-between shadow">
                <div className="flex items-center gap-3">
                    <span className="text-accent font-bold text-lg">📝 블로그 관리</span>
                </div>
                <Link to="/admin/dashboard" className="text-primary-foreground/70 hover:text-primary-foreground text-sm font-medium">← 대시보드로</Link>
            </div>

            <div className="container mx-auto px-4 py-8 max-w-5xl">
                <div className="flex sm:flex-row flex-col gap-4 sm:justify-between sm:items-center mb-8">
                    <div>
                        <h2 className="text-2xl font-extrabold text-foreground">부동산 소식 관리</h2>
                        <p className="text-sm text-muted-foreground mt-1">고객들을 유입시킬 수 있는 정보성 콘텐츠 ({posts.length}개)</p>
                    </div>
                    <Button onClick={() => { setCurrentPost({}); setIsEditing(true); }} className="bg-accent text-accent-foreground gap-1.5 font-bold h-11 px-6 shadow border-none">
                        <Plus className="w-5 h-5" /> 새 소식 작성
                    </Button>
                </div>

                <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
                    {posts.length === 0 ? (
                        <div className="py-20 text-center flex flex-col items-center">
                            <span className="text-5xl mb-4 opacity-50">📭</span>
                            <p className="text-foreground font-semibold">아직 작성된 소식이 없습니다.</p>
                            <p className="text-sm text-muted-foreground mt-2">유익한 정보를 올려 방문자 수를 늘려보세요.</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-border">
                            {posts.map(post => (
                                <div key={post.id} className="p-4 sm:p-5 flex items-center gap-4 sm:gap-6 hover:bg-muted/40 transition-colors">
                                    {post.imageUrl ? (
                                        <img src={post.imageUrl} className="w-24 h-16 sm:w-32 sm:h-20 object-cover rounded-md border border-border flex-shrink-0" />
                                    ) : (
                                        <div className="w-24 h-16 sm:w-32 sm:h-20 bg-muted flex items-center justify-center rounded-md border border-border text-3xl flex-shrink-0">📰</div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <Link to={`/blog/${post.id}`} target="_blank" className="text-base sm:text-lg font-bold text-foreground hover:text-accent truncate block">{post.title}</Link>
                                        <div className="text-sm text-muted-foreground mt-1 truncate">{post.excerpt}</div>
                                        <div className="text-xs text-muted-foreground/80 mt-2">{new Date(post.createdAt).toLocaleDateString()}</div>
                                    </div>
                                    <div className="flex flex-col sm:flex-row gap-2 shrink-0">
                                        <button onClick={() => { setCurrentPost(post); setIsEditing(true); }} className="p-2 bg-background border border-border hover:bg-muted text-foreground rounded transition-colors" title="수정"><Pencil className="w-4 h-4" /></button>
                                        <button onClick={() => handleDelete(post.id)} className="p-2 bg-background border border-border hover:bg-muted text-destructive rounded transition-colors" title="삭제"><Trash2 className="w-4 h-4" /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
