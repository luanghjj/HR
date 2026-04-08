-- Tạo Storage bucket cho documents
INSERT INTO storage.buckets (id, name, public) 
VALUES ('documents', 'documents', true)
ON CONFLICT (id) DO NOTHING;

-- RLS cho storage: allow all authenticated users
CREATE POLICY "docs_upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'documents');
CREATE POLICY "docs_read" ON storage.objects FOR SELECT USING (bucket_id = 'documents');
CREATE POLICY "docs_delete" ON storage.objects FOR DELETE USING (bucket_id = 'documents');
