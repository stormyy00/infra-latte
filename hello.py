
class HelloWorld:
    """A simple class to demonstrate a greeting."""
    
    def __init__(self):
        self.name = "Hello, World!"

    def greet(self):
        return self.name
    def main():
        hello = HelloWorld()
        print(hello.greet())
        