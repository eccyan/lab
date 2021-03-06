import java.net._
import java.io._

import scala.actors._
import scala.collection._
import scala.actors.Actor._

// $BL?Na%/%i%9(B
case class Operator(operator: String)

case class Program(socket: Socket)

object BrainFuckInterpreter extends Actor {
    implicit def inputStreamWrapper(in: InputStream) =
	new BufferedReader(new InputStreamReader(in))
    implicit def outputStreamWrapper(out: OutputStream) =
	new PrintWriter(new OutputStreamWriter(out))

//TODO:$B%W%m%0%i%`%P%C%U%!A`:n(B
    def operation(operator: Operator) {
	operator match {
	    case Operator(">") => {
		(buffer:Array[Byte], position:Int) => { 
		    (buffer, position + 1)
		}
	    }
	    case Operator("<") => {
		(buffer:Array[Byte], position:Int) => {
		    (buffer, position - 1)
		}
	    }
	    case Operator("+") => {
		(buffer:Array[Byte], position:Int) => {
		    buffer(position) = (buffer(position) + 1).toByte
		    (buffer, position)
		}
	    }
	    case Operator("-") => {
		(buffer:Array[Byte], position:Int) => {
		    buffer(position) = (buffer(position) - 1).toByte
		    (buffer, position)
		}
	    }
	    case Operator("[") => {
		(buffer:Array[Byte], position:Int) => {
		    def counter(c:Int, op:Operator) : Int = {
			op match {
			    case Operator("[") => c + 1
			    case Operator("]") => c - 1
			    case _ => c
			}
		    }
		    def jump(c:Int, p:Int) : Int = {
		    	if (buffer(p) == 0 || c == 0) p else jump( counter(c, buffer(p)), p - 1 )
		    }
		    (buffer, jump(1, position) + 1)
		}
	    }
	    case Operator("]") => {
		(buffer:Array[Byte], position:Int) => {
		    def counter(c:Int, op:Operator) : Int = {
			op match {
			    case Operator("[") => c - 1
			    case Operator("]") => c + 1
			    case _ => c
			}
		    }
		    def jump(c:Int, p:Int) : Int = {
		    	if (buffer(p) == 0 || c == 0) p else jump( counter(c, buffer(p)), p - 1 )
		    }
		    (buffer, jump(1, position))
		}
	    }
	    case _ => {
		(buffer:Array[Byte], position:Int) => {
		    (buffer, position)
		}
	    }

	}
    }
    def run(in: BufferedReader, out: PrintWriter) {
    	def makeOperatorList(c:Int, list:List[Operator]) : List[Operator] = {
	    if (c == -1) {
		list
	    }
	    else { 
	    	val read = in.read()
		makeOperatorList(read, (Operator(read toString)) :: list)
	    }
	}
	val operators = makeOperatorList(0, List()) reverse
	val operations = operators map(op => operation(op))

//TODO: Operations $B$r=g<!<B9T$9$k(B
	
	out.println( )
	out.flush
    }

    def act() {
	loop {
	    receive {
		case Program(socket) =>
		    actor {
			run(socket.getInputStream(), socket.getOutputStream())
			socket.close
		    }
	    }
	}
    }
}

object Server {
    BrainFuckInterpreter.start

    val serverSocket = new ServerSocket(12111)

    def start() {
	while(true) {
	    println("about to block")
	    val socket = serverSocket.accept()
	    BrainFuckInterpreter ! Program(socket)
	    println("back from actor")
	}
    }
}

Server.start
