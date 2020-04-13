# Flutter入门

## text

```dart
import 'package:flutter/material.dart';

void main () => runApp(MyApp());

class MyApp extends StatelessWidget{
  // 覆盖
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Text widget',
      // 脚手架
      home: Scaffold(
        body: Center(
          child: Container(
            child: new Text('Hellow LinDaiDai',style: TextStyle(fontSize: 40.0)),
            alignment: Alignment.topLeft,
            width: 500.0,
            height: 400.0,
            padding: const EdgeInsets.fromLTRB(10.0, 20.0, 10.0, 20.0),
            decoration: new BoxDecoration(
              gradient: const LinearGradient(
                colors: [Colors.lightBlue, Colors.lightGreenAccent, Colors.purple]
              ),
              border: Border.all(width: 5.0, color: Colors.redAccent)
            )
          ),
        ),
      ),
    );
  }
}
```



## image

```dart
					child: Container(
            child: new Image.network(
              'https://lindaidai.wang/images/lindaidai-logo.jpg',
              repeat: ImageRepeat.noRepeat,
            ),
            width: 300.0,
            height: 200.0,
            color: Colors.lightGreen,
          ),
```



## listView

### Basic

```dart
			home: Scaffold(
        appBar: new AppBar(title: new Text('LinDaiDai'),),
        body: new ListView(
          children: <Widget>[
            new Image.network('https://lindaidai.wang/images/lindaidai-logo.jpg'),
            new Image.network('https://lindaidai.wang/images/lindaidai-logo.jpg'),
            new Image.network('https://lindaidai.wang/images/lindaidai-logo.jpg'),
            new Text('LinDaiDai')
          ],
        )
      ),
```



### 动态listView

```dart
import 'package:flutter/material.dart';

void main() => runApp(MyApp(
  items: new List<String>.generate(1000, (i) => "Item $i")
));

// 静态组件
class MyApp extends StatelessWidget {

  final List<String> items;
  MyApp({Key key, @required this.items}):super(key:key);

  // 覆盖
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Text widget',
      // 脚手架
      home: Scaffold(
        appBar: new AppBar(
          title: new Text('LinDaiDai'),
        ),
        body: new ListView.builder(
          itemCount: items.length,
          itemBuilder: (context, index){
            return new ListTile(
              title: new Text('${items[index]}'),
            );
          },
        )
      ),
    );
  }
}

```



## GridView

网格

旧的写法

```
body: GridView.count(
          padding: const EdgeInsets.all(20.0),
          crossAxisSpacing: 10.0,
          crossAxisCount: 3,
          children: <Widget>[
            const Text('I am LinDaiDai'),
            const Text('I am wang'),
            const Text('I am LinDaiDai'),
            const Text('I am LinDaiDai'),
            const Text('I am LinDaiDai'),
            const Text('I am LinDaiDai'),
          ],
        )
```



```dart
body: GridView(
          gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: 3,
            mainAxisSpacing: 2.0,
            crossAxisSpacing: 2.0,
            childAspectRatio: 0.7
          ),
          children: <Widget>[
            new Image.network('http://img5.mtime.cn/mt/2018/10/22/104316.77318635_180X260X4.jpg',fit: BoxFit.cover),
             new Image.network('http://img5.mtime.cn/mt/2018/10/10/112514.30587089_180X260X4.jpg',fit: BoxFit.cover),
             new Image.network('http://img5.mtime.cn/mt/2018/11/13/093605.61422332_180X260X4.jpg',fit: BoxFit.cover),
             new Image.network('http://img5.mtime.cn/mt/2018/11/07/092515.55805319_180X260X4.jpg',fit: BoxFit.cover),
             new Image.network('http://img5.mtime.cn/mt/2018/11/21/090246.16772408_135X190X4.jpg',fit: BoxFit.cover),
             new Image.network('http://img5.mtime.cn/mt/2018/11/17/162028.94879602_135X190X4.jpg',fit: BoxFit.cover),
             new Image.network('http://img5.mtime.cn/mt/2018/11/19/165350.52237320_135X190X4.jpg',fit: BoxFit.cover),
             new Image.network('http://img5.mtime.cn/mt/2018/11/16/115256.24365160_180X260X4.jpg',fit: BoxFit.cover),
             new Image.network('http://img5.mtime.cn/mt/2018/11/20/141608.71613590_135X190X4.jpg',fit: BoxFit.cover),
          ],
        )
```



## Row 水平布局

```dart
			body: new Row(
          children: <Widget>[
            // 不灵活布局
            new RaisedButton(
              onPressed: (){},
              color: Colors.redAccent,
              child: new Text('Red'),
            ),
            // 加上Expanded为灵活布局,相当于css中的flex: 1
            Expanded(child: new RaisedButton(
              onPressed: (){},
              color: Colors.yellowAccent,
              child: new Text('yellow'),
            ),),
            new RaisedButton(
              onPressed: (){},
              color: Colors.blueAccent,
              child: new Text('blue'),
            ),
          ],
        )
```



## Navigator

商品列表 + 商品详情跳转 + 商品返回并传递返回值

```dart
import 'package:flutter/material.dart';

class Product {
  final String title;
  final String description;
  Product(this.title, this.description);
}

void main() {
  runApp(MaterialApp(
    title: '数据传递案例',
    home: ProductList(
      products: List.generate(20, (i) => Product('商品 $i', '我是商品详情, 编号为:$i'))
    ),
  ));
}

class  ProductList extends StatelessWidget {
  final List<Product> products;
  const ProductList({Key key, @required this.products}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('商品列表'),
      ),
      body: ListView.builder(
        itemCount: products.length,
        itemBuilder: (context, index) {
          return ListTile(
            title: Text(products[index].title),
            onTap: () {
              _navigateToDetail(context, products[index]);
            },
          );
        },
      ),
    );
  }

  _navigateToDetail (BuildContext context, Product product) async {
    final result = await Navigator.push(
      context, 
      MaterialPageRoute(builder: (context) => ProductDetail(
        product: product
      ))
    );

    Scaffold.of(context).showSnackBar(SnackBar(content: Text('$result'),));
  }
}

class ProductDetail extends StatelessWidget {
  final Product product;
  const ProductDetail({Key key, @required this.product}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('${product.title}的商品详情'),),
      body: Center(
        child: Container(
          alignment: Alignment.center,
          width: 300.0,
          height: 200.0,
          padding: const EdgeInsets.all(10.0),
          decoration: new BoxDecoration(
            gradient: const LinearGradient(
              colors: [Colors.blueAccent, Colors.yellowAccent, Colors.redAccent]
            )
          ),
          child: Column(
            children: <Widget>[
              Text('${product.description}'),
              RaisedButton(
                child: Text('返回'),
                onPressed: () {
                  Navigator.pop(context, '我是商品${product.title}的返回值');
                },
              )
            ],
          ),
        )
      ),
    );
  }
}
```



## 路由动画切换效果

`main.dart`

```dart
import 'package:flutter/material.dart';
import './custorm_router.dart';

void main() {
  runApp(MaterialApp(
    title: 'LinDaiDai',
    theme: ThemeData.dark(),
    home: FirstPage(),
  ));
}

class FirstPage extends StatelessWidget {
  const FirstPage({Key key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('First Page'),
        backgroundColor: Colors.blue,
        elevation: 0.0,
      ),
      backgroundColor: Colors.blue,
      body: Center(
        child: MaterialButton(
            child: Icon(
              Icons.navigate_next,
              color: Colors.white,
              size: 64.0,
            ),
            onPressed: () {
              Navigator.of(context)
                  .push(CustomeRouter(SecondPage()));
            }),
      ),
    );
  }
}

class SecondPage extends StatelessWidget {
  const SecondPage({Key key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Second Page'),
        backgroundColor: Colors.pinkAccent,
        elevation: 0.0,
      ),
      backgroundColor: Colors.pinkAccent,
      body: Center(
        child: MaterialButton(
            child: Icon(
              Icons.navigate_next,
              color: Colors.white,
              size: 64.0,
            ),
            onPressed: () {
              Navigator.of(context).pop();
            }),
      ),
    );
  }
}

```

`custom_router.dart`

```dart
import 'package:flutter/material.dart';

class CustomeRouter extends PageRouteBuilder {
  final Widget widget;
  CustomeRouter(this.widget)
      : super(
            transitionDuration: const Duration(seconds: 1),
            pageBuilder: (
              BuildContext context,
              Animation<double> animation1,
              Animation<double> animation2,
            ) {
              return widget;
            },
            transitionsBuilder: (BuildContext context,
                Animation<double> animation1,
                Animation<double> animation2,
                Widget child) {
              // 渐变
              // return FadeTransition(
              //   opacity: Tween(begin: 0.0, end: 1.0).animate(CurvedAnimation(
              //       parent: animation1, curve: Curves.fastOutSlowIn)),
              //   child: child);
              // 缩放
              // return ScaleTransition(
              //   scale: Tween(begin: 0.0, end: 1.0).animate(CurvedAnimation(
              //       parent: animation1, curve: Curves.fastOutSlowIn)),
              //   child: child,
              // );
              // 旋转 + 缩放
              // return RotationTransition(
              //   turns: Tween(begin: 0.0, end: 1.0).animate(CurvedAnimation(
              //       parent: animation1, curve: Curves.fastOutSlowIn)),
              //   child: ScaleTransition(
              //     scale: Tween(begin: 0.0, end: 1.0).animate(CurvedAnimation(
              //         parent: animation1, curve: Curves.fastOutSlowIn)),
              //     child: child,
              //   ),
              // );
              // 左滑右滑效果
              return SlideTransition(
                position: Tween<Offset>(
                  begin: Offset(-1.0, 0.0),
                  end:Offset(0.0, 0.0)
                )
                .animate(CurvedAnimation(
                  parent: animation1,
                  curve: Curves.fastOutSlowIn
                )),
                child: child,
              );
            });
}

```


