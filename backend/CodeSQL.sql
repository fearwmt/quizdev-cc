SELECT 
  c.room_name,
  s.grade,
  s.gender,
  COUNT(*) AS total_students
FROM student s
LEFT JOIN classroom c ON s.classroom_id = c.id
GROUP BY s.grade, c.room_name, s.gender;
