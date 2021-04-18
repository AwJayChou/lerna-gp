## lerna 多版本管理

### 内部packages相互依赖
lerna link

### 添加公共依赖
假设 moduleA 和 moduleB 都依赖 lodash
lerna add lodash
添加单独依赖
假设moduleA 自己依赖 jquery，moduleB 自己依赖 zepto

```javascript
lerna add jquery --scope=@fengyinchao/modulea
lerna add zepto --scope=@fengyinchao/moduleb
```

#### 注意 scope 的值对应的是 package.json 中的 name 字段
#### 重要：添加packages里其它模块作为自己的依赖
假设moduleA 依赖 moduleB
lerna add @fengyinchao/moduleb --scope=@fengyinchao/modulea
lerna link // 不执行会报错
注意这种依赖不会添加到 moduleA 的 node_modules 里，但会添加到 moduleA 的 package.json 中，它会自动检测到 @fengyinchao/moduleb 隶属于当前项目，直接采用symlink的方式关联过去
全 package 发布
lerna publish
注意使用 lerna publish命令之前需要将代码commit并推送到远端仓库(首次发布时)，然后可以依次为每个 package 选择要发布的版本
卸载包
给 moduleA 移除一个依赖 husky
lerna exec --scope=@fengyinchao/modulea  npm uninstall husky
批量运行 npm script 脚本
lerna run test # 运行所有包的 test 命令
lerna run --scope my-component test # 运行 my-component 模块下的 test
lerna run --parallel watch # 观看所有包并在更改时发报，流式处理前缀输出
抽离公共模块
上面 moduleA 和 moduleB 都依赖了 lodash，且在各自 package 下的node_modules 里都有副本，这其实很浪费空间，可以使用 --hoist
lerna bootstrap --hoist
软链接的概念
相关文档
https://segmentfault.com/a/1190000005591954
关于软链接的补充
上面的例子 ln -s file file-soft 给我们的感觉像是 file-soft 是“凭空”出现的。当我们跨目录来创建软链接时，可能会“幻想”这样的命令也是可以生效的：ln -s ~/development/mod ~/production/dir-not-exits/mod。
这里并没有 ~/production/dir-not-exits/ 这个目录，而软链接本质上是一个新的“文件”，所以，我们不可能正确建立软链接（会报错说 “no such file or directory”）。
如果我们先通过 mkdir 建立好目录 ~/production/dir-not-exits/，再进行软链接，即可达到预期效果。
fs.symlink
在 node 中，我们可以使用方法 fs.symink(target, path) 建立软链接（符号链接），没有直接的方法建立硬链接（就算通过子进程的方式直接指向 shell 命令也不能跨平台）。
如果是对目录建立链接，请总是传递第三个参数 dir（虽然第三个参数只在 windows 下生效，这可以保证代码跨平台）：fs.symlink(target, path, 'dir')。
为啥这个接口的参数会是 target 和 path。实际上这是一个 linux 的 API，symlink(target, linkpath)。它是这样描述的：建立一个名为 linkpath 的符号链接并且含有内容 target。其实就是让 linkpath 指向 target，和 ln -s source target 功能一样，让 target 指向 source。
是不是有点晕？其实我们只需要明白 ln -s 和 fs.symlink 后面传递的两个参数顺序是一致的，只是叫法不一样，使用起来也就没那么纠结了：
ln -s file file-soft # file-soft -> file
ln -s dir dir-soft # dir-soft -> dir
fs.symlinkSync('file', 'file-soft'); // file-soft -> file
fs.symlinkSync('dir', 'dir-soft', 'dir'); // dir-soft -> dir
