import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Suas credenciais diretas e configuradas com segurança
const supabaseUrl = 'https://jsjzejenanmjsgksoixw.supabase.co';
const supabaseAnonKey = 'sb_publishable_M53uK9WdNKnFgcx0xLdmow_95nh8UJp';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get('filename') || `video_${Date.now()}.mp4`;

    const formData = await request.formData();
    const file = formData.get('video') as File;

    if (!file) {
      return NextResponse.json({ error: 'Nenhum arquivo enviado.' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // Envia o vídeo para a pasta dentro do bucket 'videos'
    const { data, error } = await supabase.storage
      .from('videos')
      .upload(`public/${Date.now()}_${filename}`, buffer, {
        contentType: file.type,
        upsert: true
      });

    if (error) throw error;

    // Puxa a URL pública gerada no Supabase
    const { data: urlData } = supabase.storage
      .from('videos')
      .getPublicUrl(data.path);

    return NextResponse.json({ url: urlData.publicUrl });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
