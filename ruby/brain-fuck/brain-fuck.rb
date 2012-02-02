# -*- coding: utf-8 -*-
class String
  def fuck
    identity = lambda do |value|
      return value
    end
    increment = lambda do |value|
      return value+1
    end
    decrement = lambda do |value|
      return value-1
    end

    increment_pc = lambda do |pc, memory, pointer|
      return (increment.call pc), memory, pointer
    end
    decrement_pc = lambda do |pc, memory, pointer|
      return [0, (decrement.call pc)].max, memory, pointer
    end

    increment_pointer = lambda do |pc, memory, pointer|
      memory[increment.call pointer] ||= 0 
      return increment_pc.call pc, memory, (increment.call pointer)
    end
    decrement_pointer = lambda do |pc, memory, pointer|
      return increment_pc.call pc, memory, [0, (decrement.call pointer)].max
    end
    increment_value = lambda do |pc, memory, pointer|
      memory[pointer] = (increment.call (memory.fetch pointer)) & 0xff
      return increment_pc.call pc, memory, pointer
    end
    decrement_value = lambda do |pc, memory, pointer|
      memory[pointer] = (decrement.call (memory.fetch pointer)) & 0xff
      return increment_pc.call pc, memory, pointer
    end

    loop_out = lambda do |pc, memory, pointer|
      find = lambda do |pc, nest|
        return pc if nest.zero?
        new_pc = increment.call pc
        operation = {?[ => increment, ?] => decrement}.fetch (self.slice new_pc), identity
        find.call new_pc, (operation.call nest)
      end
      return increment_pc.call pc, memory, pointer if (memory.at pointer).nonzero?
      return find.call(pc, 1), memory, pointer
    end
    loop_in = lambda do |pc, memory, pointer|
      find = lambda do |pc, nest|
        return pc if nest.zero?
        new_pc = decrement.call pc
        operation = {?[ => decrement, ?] => increment}.fetch (self.slice new_pc), identity 
        find.call new_pc, (operation.call nest)
      end
      return increment_pc.call pc, memory, pointer if (memory.at pointer).zero?
      return find.call(pc, 1), memory, pointer
    end
    
    operations = {
      ?+ => increment_value, ?- => decrement_value,
      ?> => increment_pointer, ?< => decrement_pointer,
      ?[ => loop_out, ?] => loop_in,
    }
    pc = 0 #pragram counter
    memory = [0]
    pointer = 0
    while self.size > pc 
      pc, memory, pointer = (operations.fetch (self.slice pc), increment_pc)
        .call pc, memory, pointer
    end

    memory
  end
end

'+'.fuck #=> [1]
'-'.fuck #=> [255]
'>'.fuck #=> [0, 0]
'<'.fuck #=> [0]
'++コメント++'.fuck #=> [4]
'+++[>+<-]'.fuck #=> [0, 3]
('+'*256).fuck #=> [0]
'+>+'.fuck #=> [1, 1]
'>><+'.fuck #=> [0, 1, 0]
