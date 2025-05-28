-- Create export_audit_logs table
CREATE TABLE IF NOT EXISTS export_audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  format TEXT NOT NULL,
  filters JSONB NOT NULL,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL CHECK (status IN ('in_progress', 'completed', 'failed')),
  error TEXT,
  ip_address TEXT NOT NULL,
  user_agent TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_export_audit_logs_user_id ON export_audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_export_audit_logs_status ON export_audit_logs(status);
CREATE INDEX IF NOT EXISTS idx_export_audit_logs_created_at ON export_audit_logs(created_at);

-- Create RLS policies
ALTER TABLE export_audit_logs ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own audit logs
CREATE POLICY "Users can view their own audit logs"
  ON export_audit_logs
  FOR SELECT
  USING (auth.uid() = user_id);

-- Allow users to insert their own audit logs
CREATE POLICY "Users can insert their own audit logs"
  ON export_audit_logs
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own audit logs
CREATE POLICY "Users can update their own audit logs"
  ON export_audit_logs
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Create function to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_export_audit_logs_updated_at
  BEFORE UPDATE ON export_audit_logs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column(); 