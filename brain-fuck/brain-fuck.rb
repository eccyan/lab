class String
  def fuck
    operations = {
      '+' => lambda do |buffer, position|
        buffer[position] = (buffer[position] + 1) & 0xff
        [buffer, position]
      end,
      '-' => lambda do |buffer, position|
        buffer[position] = (buffer[position] - 1) & 0xff 
        [buffer, position]
      end,
      '>' => lambda do |buffer, position|
        buffer[position + 1] ||= 0 
        [buffer, position + 1]
      end,
      '<' => lambda do |buffer, position|
        [buffer, [0, position - 1].max]
      end,
      '[' => lambda do |buffer, position|
      end,
      ']' => lambda do |buffer, position|
      end,
    }

    buffer = [0]
    position = 0
    0.upto self.size-1 do |n|
      buffer, position = operations.fetch(self.slice n).call buffer, position
    end

    buffer
  end
end

'+'.fuck #=> [1]
'-'.fuck #=> [255]
'>'.fuck #=> [0, 0]
'<'.fuck #=> [0]
('+'*256).fuck #=> [0]
'+>+'.fuck #=> [1, 1]
'>><+'.fuck #=> [0, 1, 0]
