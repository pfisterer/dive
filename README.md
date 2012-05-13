DIVE (Dennis Instant eValuation)
======

Building 
======
No installation is required. To build, you need Java 7 or higher and 
[Maven 2](http://maven.apache.org/) or higher. 

Before cloning this repository, be sure to enable automatic conversion 
of CRLF/LF on your machine using ```git config --global core.autocrlf input```. 
For more information, please refer to [this article](http://help.github.com/dealing-with-lineendings/).

Clone the repository using ```git clone```.
To build, run ```mvn install```, this will build the program and place the 
generated jar file in target/ and in your local Maven repository.

Running
======
The project uses the Java endorsed standards override mechanism to use newer versions of libraries included in the JVM.
If you run the project in an IDE or from command line make sure to add

```
-Djava.endorsed.dirs=target/endorsed
```

as a VM parameter after building the project at least once using maven.
