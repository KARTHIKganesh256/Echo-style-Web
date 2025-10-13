-- Create skin_care_analyses table for Supabase
CREATE TABLE IF NOT EXISTS skin_care_analyses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  basic_info JSONB,
  skin_type TEXT,
  skin_concerns TEXT[],
  lifestyle JSONB,
  analysis JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE skin_care_analyses ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own analyses" ON skin_care_analyses
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own analyses" ON skin_care_analyses
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own analyses" ON skin_care_analyses
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own analyses" ON skin_care_analyses
  FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_skin_care_analyses_user_id ON skin_care_analyses(user_id);
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
