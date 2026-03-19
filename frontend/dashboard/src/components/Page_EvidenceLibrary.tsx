import React, { useState, useEffect } from 'react';
import { Database, Search, FileText, Loader, AlertCircle, X } from 'lucide-react';

const API_URL = "http://127.0.0.1:8000";

const Page_EvidenceLibrary = () => {
    const [query, setQuery] = useState('');
    const [documents, setDocuments] = useState<any[]>([]);
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [docsLoading, setDocsLoading] = useState(true);
    const [searched, setSearched] = useState(false);
    const [error, setError] = useState('');

    // Load document list on mount
    useEffect(() => {
        setDocsLoading(true);
        fetch(`${API_URL}/evidence/documents`)
            .then(res => res.json())
            .then(data => {
                setDocuments(Array.isArray(data) ? data : []);
                setDocsLoading(false);
            })
            .catch(() => {
                setDocsLoading(false);
                setError('Could not connect to backend. Is the server running?');
            });
    }, []);

    const handleSearch = async () => {
        if (!query.trim()) return;
        setLoading(true);
        setSearched(true);
        setError('');
        try {
            const res = await fetch(`${API_URL}/evidence/search?q=${encodeURIComponent(query)}`);
            const data = await res.json();
            setSearchResults(data.results || []);
        } catch {
            setError('Search failed. Please check the backend connection.');
            setSearchResults([]);
        } finally {
            setLoading(false);
        }
    };

    const clearSearch = () => {
        setQuery('');
        setSearchResults([]);
        setSearched(false);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h2 className="text-3xl font-bold text-white mb-2">Evidence Library</h2>
                <p className="text-slate-400">Searchable repository of authenticated ESG documents from local knowledge base.</p>
            </div>

            {/* Search Bar */}
            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 flex gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                    <input
                        type="text"
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleSearch()}
                        placeholder="Search across ESG documents (e.g., 'Carbon credits', 'Water usage')..."
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-12 pr-10 text-white focus:outline-none focus:border-green-500 transition-colors placeholder-slate-600"
                    />
                    {query && (
                        <button onClick={clearSearch} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">
                            <X size={16} />
                        </button>
                    )}
                </div>
                <button
                    onClick={handleSearch}
                    disabled={loading || !query.trim()}
                    className="bg-green-600 hover:bg-green-500 disabled:bg-green-900 disabled:cursor-not-allowed text-white px-8 rounded-xl font-bold transition-colors flex items-center gap-2"
                >
                    {loading ? <Loader size={16} className="animate-spin" /> : <Search size={16} />}
                    {loading ? 'Searching...' : 'Search Library'}
                </button>
            </div>

            {/* Error */}
            {error && (
                <div className="flex items-center gap-3 p-4 bg-red-950/40 border border-red-500/30 rounded-xl text-red-400 text-sm">
                    <AlertCircle size={16} />
                    {error}
                </div>
            )}

            {/* Search Results */}
            {searched && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold text-white">
                            Search Results
                            <span className="ml-3 text-sm font-normal text-slate-500">
                                {searchResults.length} match{searchResults.length !== 1 ? 'es' : ''} for "{query}"
                            </span>
                        </h3>
                        <button onClick={clearSearch} className="text-xs text-slate-500 hover:text-white transition-colors">
                            Clear results
                        </button>
                    </div>

                    {searchResults.length === 0 && !loading ? (
                        <div className="p-12 text-center border border-dashed border-slate-800 rounded-2xl text-slate-500">
                            <Search size={40} className="mx-auto mb-4 opacity-30" />
                            <p>No matching documents found for "<span className="text-slate-300">{query}</span>"</p>
                            <p className="text-xs mt-2">Try broader search terms</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {searchResults.map((r, i) => (
                                <div key={i} className="bg-slate-900 border border-slate-800 hover:border-green-500/30 p-5 rounded-xl transition-all">
                                    <div className="flex items-center gap-2 mb-3">
                                        <FileText size={14} className="text-blue-400" />
                                        <span className="text-xs font-bold text-blue-400 font-mono">{r.source}</span>
                                    </div>
                                    <p className="text-sm text-slate-300 leading-relaxed line-clamp-4">{r.excerpt}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Document Library */}
            {!searched && (
                <div>
                    <h3 className="text-lg font-bold text-white mb-4">
                        Loaded Documents
                        <span className="ml-3 text-sm font-normal text-slate-500">{documents.length} file{documents.length !== 1 ? 's' : ''} in knowledge base</span>
                    </h3>

                    {docsLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl animate-pulse">
                                    <div className="w-10 h-10 bg-slate-800 rounded-lg mb-4"></div>
                                    <div className="h-4 bg-slate-800 rounded mb-2 w-3/4"></div>
                                    <div className="h-3 bg-slate-800 rounded w-1/2"></div>
                                </div>
                            ))}
                        </div>
                    ) : documents.length === 0 ? (
                        <div className="p-16 text-center border border-dashed border-slate-800 rounded-2xl text-slate-500">
                            <Database size={48} className="mx-auto mb-4 opacity-30" />
                            <p className="font-bold text-slate-400 mb-1">No documents found</p>
                            <p className="text-sm">Add ESG documents to <code className="text-slate-400 bg-slate-900 px-1 rounded">data/esg_docs/</code> to populate this library.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {documents.map((doc, i) => (
                                <div key={i} className="group bg-slate-900 border border-slate-800 hover:border-blue-500/50 p-6 rounded-2xl transition-all cursor-pointer">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="p-3 bg-blue-500/10 rounded-lg text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                                            <FileText size={24} />
                                        </div>
                                        <span className="text-[10px] font-bold uppercase text-slate-500 bg-slate-950 px-2 py-1 rounded border border-slate-800">{doc.modified}</span>
                                    </div>
                                    <h4 className="text-white font-bold mb-1 group-hover:text-blue-400 transition-colors text-sm truncate" title={doc.filename}>
                                        {doc.filename}
                                    </h4>
                                    <div className="text-xs text-slate-500">{doc.size_kb} KB</div>
                                    <div className="mt-4 pt-4 border-t border-slate-800 flex items-center gap-2 text-xs font-mono text-slate-500">
                                        <Database size={12} /> Local Knowledge Base
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Page_EvidenceLibrary;
