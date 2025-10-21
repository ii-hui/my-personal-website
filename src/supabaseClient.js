import { createClient } from '@supabase/supabase-js'

// 从你保存的记事本文件中复制这两个值
const supabaseUrl = 'https://tlxczsxuubwoeigyhmou.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRseGN6c3h1dWJ3b2VpZ3lobW91Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEwMDY4MzksImV4cCI6MjA3NjU4MjgzOX0.7QiaZ7YA4QuHqUiXvcHsj_0UFi-47BICUd1EFqyRDL4'

export const supabase = createClient(supabaseUrl, supabaseKey)
