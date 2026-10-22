'use client';

import { useState, useRef } from 'react';

export default function SupabaseVideoUpload() {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleUploadProcess = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    
    if (!file.type.startsWith('video/')) {
      alert('Por favor, selecione apenas arquivos de vídeo!');
      return;
    }

    try {
      setLoading(true);
      setVideoUrl(null);

      const formData = new FormData();
      formData.append('video', file);

      const response = await fetch(`/api/video/upload?filename=${encodeURIComponent(file.name)}`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Erro no upload');

      setVideoUrl(data.url);
    } catch (error: any) {
      console.error(error);
      alert(`Erro ao enviar o vídeo: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: '#0f172a', color: '#f8fafc', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px', fontFamily: 'sans-serif' }}>
      <div style={{ background: '#1e293b', padding: '40px', borderRadius: '12px', width: '100%', maxWidth: '500px', textAlign: 'center', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.3)' }}>
        <h1 style={{ color: '#38bdf8', marginBottom: '10px', fontSize: '24px' }}>Vídeo para Link</h1>
        <p style={{ color: '#94a3b8', marginBottom: '30px', fontSize: '14px' }}>Transforme seus vídeos em links usando a nuvem do Supabase.</p>

        <div 
          onClick={() => inputFileRef.current?.click()}
          style={{ border: '2px dashed #38bdf8', borderRadius: '8px', padding: '40px 20px', cursor: 'pointer', background: '#0f172a' }}
        >
          <p style={{ color: '#38bdf8', fontWeight: 'bold' }}>
            {loading ? 'Subindo para a nuvem...' : 'Clique aqui para escolher seu Vídeo'}
          </p>
          <input ref={inputFileRef} type="file" accept="video/*" style={{ display: 'none' }} onChange={(e) => handleUploadProcess(e.target.files)} />
        </div>

        {videoUrl && (
          <div style={{ marginTop: '25px', padding: '15px', background: '#0f172a', borderRadius: '6px', textAlign: 'left', wordBreak: 'break-all' }}>
            <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '5px' }}>Link direto gerado:</label>
            <a href={videoUrl} target="_blank" rel="noreferrer" style={{ color: '#38bdf8', fontWeight: 'bold', textDecoration: 'none', fontSize: '14px' }}>
              {videoUrl}
            </a>
            <button 
              onClick={() => { navigator.clipboard.writeText(videoUrl); alert('Link copiado!'); }}
              style={{ background: '#38bdf8', color: '#0f172a', border: 'none', padding: '10px', borderRadius: '4px', fontWeight: 'bold', marginTop: '12px', cursor: 'pointer', width: '100%' }}
            >
              Copiar Link
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
