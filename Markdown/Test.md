# Headers

# Innehållsförteckning
<!-- toc -->

# H1.hepp.å
## H2
### H3
#### H4
##### H5
###### H6

# Table
| Text | Center | Align Left | Align Right|
| ---- | :----: | :--------- | ----------:|
| Test | 1.0    | Test       | Test       |
| Test | 2.0    | Test       | Test       |
| Test | 3.0    | Test       | Test       |

# Color highlight
See [highlightjs.org](https://highlightjs.org/static/demo/) for supported languages and protocols.

## C# #
```cs
/// <summary>Test</summary>
public void Test(int i)
{
    // Comment
    string a = "text";
    return i;
}
```

## Java
```java
/**
 * @author FistName LastName <firstname.lastname@company.com>
 * @version 1.0
*/
public void Test(int i)
{
    // Comment
    String a = "text";
    return i;
}
```

## TypeScript
```TypeScript
class MyClass {
    public static myValue: string;
    constructor(init: string) {
      this.myValue = init;
    }
  }
  import fs = require("fs");
  module MyModule {
    export interface MyInterface extends OtherInterface {
      myProperty: any;
    }
  }
  declare magicNumber number;
  myArray.forEach(() => {
    // fat arrow syntax
  });
```

## Javascript
```javascript
// Comment
function fancyAlert(arg) {
  if(arg) {
    $.facebox({div:'#foo'})
  }
}
```

## JSON
```json
[
  {
    "title": "apples",
    "count": [12000, 20000],
    "description": {"text": "...", "sensitive": false}
  },
  {
    "title": "oranges",
    "count": [17500, null],
    "description": {"text": "...", "sensitive": false}
  }
]
```

## HTTP
```http
POST /task?id=1 HTTP/1.1
Host: example.org
Content-Type: application/json; charset=utf-8
Content-Length: 19

{"status": "ok", "extended": true}
```

## XML
```xml
<?xml version="1.0"?>
<!-- Comment -->
<response value="ok" xml:lang="en">
  <text>Ok</text>
  <comment html_allowed="true"/>
  <ns1:description><![CDATA[
  CDATA is <not> magical.
  ]]></ns1:description>
  <a></a> <a/>
</response>
```

## HTML
```html
<!DOCTYPE html>
<title>Title</title>

<style>body {width: 500px;}</style>

<script type="application/javascript">
  function $init() {return true;}
</script>

<body>
  <p checked class="title" id='title'>Title</p>
  <!-- here goes the rest of the page -->
</body>
```

## Markdown
```markdown
# hello world

you can write text [with links](http://example.com) inline or [link references][1].

* one _thing_ has *em*phasis
* two __things__ are **bold**

[1]: http://example.com

---

hello world
===========

<this_is inline="xml"></this_is>

> markdown is so cool

    so are code segments

1. one thing (yeah!)
2. two thing `i can write code`, and `more` wipee!
```

# Lists
* Item 1
* Item 2
    * Item 2a
    * Item 2b
        * Item 2ba
  

1. Item 1
2. Item 2
    * Item 2a
    * Item 2b
    
# Text
Regular text 

*This text will be italic*

**This text will be bold**

*You **can** combine them*

# Links
[Link](Test.md)  
[MailTo](mailto:name@company.com)

# Images
![Image](Media/Image.png)