-- Create a simple skin_care_analyses table without user references
CREATE TABLE IF NOT EXISTS skin_care_analyses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  basic_info JSONB,
  skin_type TEXT,
  skin_concerns TEXT[],
  lifestyle JSONB,
  analysis JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (optional for demo data)
ALTER TABLE skin_care_analyses ENABLE ROW LEVEL SECURITY;

-- Create policies that allow public access (for demo purposes)
CREATE POLICY "Allow public read access" ON skin_care_analyses
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert access" ON skin_care_analyses
  FOR INSERT WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_skin_care_analyses_created_at ON skin_care_analyses(created_at);
CREATE INDEX IF NOT EXISTS idx_skin_care_analyses_skin_type ON skin_care_analyses(skin_type);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_skin_care_analyses_updated_at 
  BEFORE UPDATE ON skin_care_analyses 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();








