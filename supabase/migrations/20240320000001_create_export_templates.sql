-- Create export_templates table
CREATE TABLE IF NOT EXISTS export_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  name TEXT NOT NULL,
  format TEXT NOT NULL CHECK (format IN ('excel', 'pdf', 'csv', 'json', 'xml', 'html')),
  filters JSONB NOT NULL,
  columns JSONB NOT NULL,
  custom_styles JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_export_templates_user_id ON export_templates(user_id);
CREATE INDEX IF NOT EXISTS idx_export_templates_format ON export_templates(format);
CREATE INDEX IF NOT EXISTS idx_export_templates_created_at ON export_templates(created_at);

-- Create RLS policies
ALTER TABLE export_templates ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own templates
CREATE POLICY "Users can view their own templates"
  ON export_templates
  FOR SELECT
  USING (auth.uid() = user_id);

-- Allow users to insert their own templates
CREATE POLICY "Users can insert their own templates"
  ON export_templates
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own templates
CREATE POLICY "Users can update their own templates"
  ON export_templates
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Allow users to delete their own templates
CREATE POLICY "Users can delete their own templates"
  ON export_templates
  FOR DELETE
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
CREATE TRIGGER update_export_templates_updated_at
  BEFORE UPDATE ON export_templates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column(); 