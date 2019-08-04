CREATE OR REPLACE FUNCTION json_pretty(p_json JSON,
                                       p_indent_size INTEGER DEFAULT 4,
                                       p_step INTEGER DEFAULT 0)
RETURNS TEXT
AS $$
DECLARE
  v_type TEXT;
  v_text TEXT := '';
  v_indent INTEGER;
  v_key TEXT;
  v_object JSON;
  v_count INTEGER;
BEGIN
  v_indent := COALESCE(p_indent_size, 4);
  p_step := COALESCE(p_step, 0);
  -- Object or array?
  v_type := json_typeof(p_json);
 
  IF v_type = 'object' THEN
    -- Start object
    v_text := E'{\n';
    SELECT COUNT(*) - 1 INTO v_count
    FROM json_object_keys(p_json);
    -- go through keys, add them and recurse over value
    FOR v_key IN (SELECT json_object_keys(p_json))
    LOOP
      v_text := v_text || repeat(' ', v_indent * (p_step + 1))  || to_json(v_key)::TEXT || ': ' || public.json_pretty(p_json->v_key, p_indent_size, p_step + 1);
      IF v_count > 0 THEN
        v_text := v_text || ',';
        v_count := v_count - 1;
      END IF;
      v_text := v_text || E'\n';
    END LOOP;
    -- Close object
    v_text := v_text || repeat(' ', (v_indent * p_step)) || '}';
  ELSIF v_type = 'array' THEN
    -- Start array
    v_text := E'[\n';
    v_count := json_array_length(p_json) - 1;
    -- go through elements and add them through recursion
    FOR v_object IN (SELECT json_array_elements(p_json))
    LOOP
      v_text := v_text || repeat(' ', v_indent * (p_step + 1))  || public.json_pretty(v_object, p_indent_size, p_step + 1);
      IF v_count > 0 THEN
        v_text := v_text || ',';
        v_count := v_count - 1;
      END IF;
      v_text := v_text || E'\n';
    END LOOP;
    -- Close array
    v_text := v_text || repeat(' ', (v_indent * p_step)) || ']';
  ELSE -- A simple value
    v_text := v_text || p_json::TEXT;
  END IF;
  RETURN v_text;
END;
$$ LANGUAGE plpgsql;

create or replace FUNCTION json_pretty(p_json JSONB,p_indent_size INTEGER DEFAULT 4, p_step INTEGER DEFAULT 0) returns text as  $$
BEGIN
    return json_pretty(p_json::json,p_indent_size,p_step);
end;
$$LANGUAGE PLPGSQL;


 
COMMENT ON FUNCTION json_pretty(p_json JSON,
                                p_indent_size INTEGER,
                                p_step INTEGER) 
IS $$Return a JSON document AS a formatted text suitable FOR better reading FROM humans$$ ;