'use client';

import { useState, useRef } from 'react';
import type { PutBlobResult } from '@vercel/blob';
import { upload } from '@vercel/blob/client';

export default function VideoUploadPage() {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [blob, setBlob] = useState<PutBlobResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleUploadProcess = async (file: File) => {
    if (!file.type.startsWith('video/')) {
      alert('Por favor, selecione apenas arquivos de vídeo!');
      return;
    }

    try {
      setLoading(true);
      setBlob(null);

      // Upload direto para a nuvem de forma segura e sem limite de 4.5MB
      const newBlob = await upload(file.name, file, {
        access: 'public',
        handleUploadUrl: '/api/video/upload',
      });

      setBlob(newBlob);
    } catch (error) {
      console.error(error);
      alert('Erro ao enviar o vídeo. Verifique se o Storage está conectado.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      background: '#0f172a', color: '#f8fafc', minHeight: '100vh',
      display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px', fontFamily: 'sans-serif'
    }}>
      <div style={{ background: '#1e293b', padding: '40px', borderRadius: '12px', width: '100%', maxWidth: '500px', textAlign: 'center', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.3)' }}>
        <h1 style={{ color: '#38bdf8', marginBottom: '10px', fontSize: '24px' }}>Vídeo para Link</h1>
        <p style={{ color: '#94a3b8', marginBottom: '30px', fontSize: '14px' }}>Envie seu filme ou vídeo e obtenha um link de nuvem instantâneo.</p>

        <div 
          onClick={() => inputFileRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={() => setDragActive(false)}
          onDrop={(e) => { e.preventDefault(); setDragActive(false); if(e.dataTransfer.files?.[0]) handleUploadProcess(e.dataTransfer.files[0]); }}
          style={{
            border: `2px dashed ${dragActive ? '#7dd3fc' : '#38bdf8'}`,
            borderRadius: '8px', padding: '40px 20px', cursor: 'pointer', background: '#0f172a', transition: '0.3s'
          }}
        >
          <p style={{ color: '#38bdf8', fontWeight: 'bold' }}>
            {loading ? 'Enviando para a nuvem...' : 'Clique ou Arraste o Vídeo Aqui'}
          </p>
          <input name="file" ref={inputFileRef} type="file" accept="video/*" style={{ display: 'none' }} onChange={(e) => { if(e.target.files?.[0]) handleUploadProcess(e.target.files[0]); }} required />
        </div>

        {loading && (
          <div style={{ width: '100%', height: '6px', background: '#334155', borderRadius: '4px', marginTop: '20px', overflow: 'hidden' }}>
            <div style={{ width: '50%', height: '100%', background: '#38bdf8', animation: 'pulse 1.5s infinite ease-in-out' }}></div>
          </div>
        )}

        {blob && (
          <div style={{ marginTop: '25px', padding: '15px', background: '#0f172a', borderRadius: '6px', textAlign: 'left', wordBreak: 'break-all' }}>
            <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '5px' }}>Seu link gerado:</label>
            <a href={blob.url} target="_blank" rel="noreferrer" style={{ color: '#38bdf8', fontWeight: 'bold', textDecoration: 'none', fontSize: '14px' }}>
              {blob.url}
            </a>
            <button 
              onClick={() => { navigator.clipboard.writeText(blob.url); alert('Link copiado!'); }}
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
