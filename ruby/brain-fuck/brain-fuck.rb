# -*- coding: utf-8 -*-
class String
  def fuck(output=STDOUT, input=STDIN)
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
      return increment.(pc), memory, pointer
    end
    decrement_pc = lambda do |pc, memory, pointer|
      return [0, decrement.(pc)].max, memory, pointer
    end

    increment_pointer = lambda do |pc, memory, pointer|
      new_memory = if increment.(pointer) < memory.size then memory else memory.concat([0]) end
      return increment_pc.(pc, new_memory, increment.(pointer))
    end
    decrement_pointer = lambda do |pc, memory, pointer|
      return increment_pc.(pc, memory, [0, decrement.(pointer)].max)
    end
    increment_value = lambda do |pc, memory, pointer|
      new_memory = memory.map.with_index do |value, index| 
	if index == pointer then
	  increment.(memory[pointer]) & 0xff 
	else
	  value
	end
      end
      return increment_pc.(pc, new_memory, pointer)
    end
    decrement_value = lambda do |pc, memory, pointer|
      new_memory = memory.map.with_index do |value, index| 
	if index == pointer then
	  decrement.(memory[pointer]) & 0xff
	else
	  value
	end
      end
      return increment_pc.(pc, new_memory, pointer)
    end

    get = lambda do |pc, memory, pointer|
      new_memory = memory.map.with_index do |value, index|
	if index == pointer then 
	  input.getc.bytes.to_a[0] 
	else 
	  value
	end
      end
      return increment_pc.(pc, new_memory, pointer)
    end
    put = lambda do |pc, memory, pointer|
      output.putc memory[pointer]
      return increment_pc.(pc, memory, pointer)
    end

    loop_out = lambda do |pc, memory, pointer|
      find = lambda do |pc, nest|
        return pc if nest.zero?
        new_pc = increment.(pc)
        operation = {?[ => increment, ?] => decrement}.fetch(self.slice(new_pc), identity)
        find.(new_pc, operation.(nest))
      end
      return increment_pc.(pc, memory, pointer) if (memory.at pointer).nonzero?
      return find.(pc, 1), memory, pointer
    end
    loop_in = lambda do |pc, memory, pointer|
      find = lambda do |pc, nest|
        return pc if nest.zero?
        new_pc = decrement.call pc
        operation = {?[ => decrement, ?] => increment}.fetch(self.slice(new_pc), identity)
        find.(new_pc, operation.(nest))
      end
      return increment_pc.(pc, memory, pointer) if (memory.at pointer).zero?
      return find.(pc, 1), memory, pointer
    end
    
    operations = {
      ?+ => increment_value, ?- => decrement_value,
      ?> => increment_pointer, ?< => decrement_pointer,
      ?, => get, ?. => put,
      ?[ => loop_out, ?] => loop_in,
    }

    run = lambda do |pc, memory, pointer|
      return memory unless pc < self.size
      p, m, pt = operations.fetch(self.slice(pc), increment_pc).(pc, memory, pointer)
      run.(p, m, pt)
    end

    run.(0, [0], 0)
  end
end

','.fuck

'+++++++++[>++++++++>+++++++++++>+++++<<<-]>.>++.+++++++..+++.>-.
------------.<++++++++.--------.+++.------.--------.>+.'.fuck

