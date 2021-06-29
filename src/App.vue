<template>
  <div id="app">
    <Form ref="form" :model="form" :rules="rules" :label-width="100">
      <FormItem label="商品标题" prop="title">
        <Input type="text" v-model="form.title" placeholder="请输入商品标题"></Input>
      </FormItem>
      <FormItem label="商品图片" prop="images">
        <x-media v-model="form.images"
                 :urls="urls"
                 :max="5"
                 @callback="callback"
                 :config="config">
          插入文件
        </x-media>
      </FormItem>
      <div>
        <Row>
          <Col span="24">
            <FormItem style="height: 10px;" label="规格参数">
              <Row :gutter="10">　
                <Col span="2">
                  型号
                </Col>
                <Col span="2">
                  规格
                </Col>
                <Col span="2">
                  价格
                </Col>
                <Col span="2">
                  库存
                </Col>
                <Col span="3">
                  货号
                </Col>
                <Col span="3">
                  缩略图
                </Col>
                <Col span="3">
                  操作
                </Col>
              </Row>
            </FormItem>
          </Col>
        </Row>
        <FormItem
          v-for="(item, index) in form.items"
          :key="index"
          :label="'单品 ' + (index+1) ">
          <Row :gutter="10">
            <Col span="2">
              <Poptip trigger="focus">
                <Input type="text" v-model="item.module"
                       placeholder="请输入型号"></Input>
                <div slot="content">{{ formatText(item.module) }}</div>
              </Poptip>
            </Col>
            <Col span="2">
              <Poptip trigger="focus">
                <Input type="text" v-model="item.standard"
                       placeholder="请输入规格"></Input>
                <div slot="content">{{ formatText(item.standard) }}</div>
              </Poptip>
            </Col>
            <Col span="2">
              <Poptip trigger="focus">
                <Input type="text" v-model="item.price"
                       placeholder="请输入价格"></Input>
                <div slot="content">{{ formatText(item.price) }}</div>
              </Poptip>
            </Col>
            <Col span="2">
              <Poptip trigger="focus">
                <Input type="text" v-model="item.reserve"
                       placeholder="请输入库存"></Input>
                <div slot="content">{{ formatText(item.reserve) }}</div>
              </Poptip>
            </Col>
            <Col span="2">
              <Poptip trigger="focus">
                <Input type="text" v-model="item.sku"
                       placeholder="请输入货号"></Input>
                <div slot="content">{{ formatText(item.sku) }}</div>
              </Poptip>
            </Col>
            <Col span="3">
              <x-media v-model="item.images"
                       :urls="urls"
                       :max="1"
                       type="string"
                       :config="config">
              </x-media>
            </Col>
            <Col span="3">
              <Button :disabled="!index" @click="handleRemove(index)">删除</Button>
            </Col>
          </Row>
        </FormItem>
        <FormItem>
          <Row>
            <Col span="12">
              <Button type="dashed" long @click="handleAdd" icon="plus-round">新增单品</Button>
            </Col>
          </Row>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="handleSubmit">创建</Button>
          <Button @click="handleReset" style="margin-left: 8px">重置</Button>
        </FormItem>
      </div>
    </Form>
  </div>
</template>

<script>

export default {
  name: 'app',
  data() {
    return {
      visible: false,
      form: {
        title: null,
        images: null,
        // images: 'http://delii.oss-cn-shanghai.aliyuncs.com/rakan/default/NJGDZQ/San%20Francisco.jpg',
        items: [
          {
            sku: null,
            module: null,
            standard: null,
            price: null,
            reserve: null,
            images: '//canarys.oss-cn-shanghai.aliyuncs.com/rakan/default/XPnkavz1/sparrow/hn_wssc.zip',
          }, {
            sku: null,
            module: null,
            standard: null,
            price: null,
            reserve: null,
            images: null,
          }
        ]
      },
      urls: {
        index: 'index.json',     //获取文件地址
        upload: '',       //上传地址
        create: '',   //创建目录地址
        alias: '',         //显示地址
        check: '',     //检查文件唯一
        policy: '',   //获取上传策略地址
        delete: '',    //删除文件或目录地址
        visible: '', //设置文件可见性
        paste: '',     //复制剪切文件目录
        rename: '',   //重命名文件
        remote: '',
        default: '',
      },
      bookmark: {
        index: 'http://www.alaska.local/api/file/bookmark/index',
        create: '',
        delete: '',
      },
      config: {
        format: [
          'jpg', 'png', 'jpeg',
        ],     //上传类型限制
        size: 0,        //上传大小限制
        random: false,  //是否启用随机文件名
        key: 'id',
        style: '',
        gateway: 'oss',
        folder: false,
        remote: false,
        width: '100%'
      },
      rules: {
        title: {
          required: true,
          message: '请输入商品名称',
          trigger: 'change'
        },
        images: {
          required: true,
          type: 'array',
          message: '请选择商品图片',
          trigger: 'change'
        }
      },
      max: 1,
      random: true,
      id: null,
      images1: '',
      images2: [],
      images3: [
        {
          url: '//sds'
        }
      ],

      msg: 'Welcome to Your Vue.js App'
    }
  },
  methods: {
    callback(val) {
      console.log(val)
    },
    handleCreate() {
      this.clear();
      this.visible = true;
    },
    handleSubmit() {
      console.log(this.form)

      this.$refs.form.validate((valid) => {
        if (valid) {
          console.log('Success!');
        } else {
          console.error('Fail!');
        }
      });
    },
    demo() {
      this.form = {
        images: null
      }
      console.log('重置 内部')
    },
    handleReset() {

      var time = localStorage.getItem('time') ? localStorage.getItem('time') : 1;

      localStorage.setItem('time', time++)
      this.form = {
        images: null
      }

      let that = this;

      // setTimeout(function () {

      that.form = {
        images: [
          {
            url: 'http://delii.oss-cn-shanghai.aliyuncs.com/rakan/default/NJGDZQ/San%20Francisco.jpg',
          }, {
            url: 'http://delii.oss-cn-shanghai.aliyuncs.com/rakan/default/NJGDZQ/San%20Francisco.jpg',
          }, {
            url: 'http://delii.oss-cn-shanghai.aliyuncs.com/rakan/default/NJGDZQ/San%20Francisco.jpg',
          }, {
            url: 'http://delii.oss-cn-shanghai.aliyuncs.com/rakan/default/NJGDZQ/San%20Francisco.jpg',
          }, {
            url: 'http://delii.oss-cn-shanghai.aliyuncs.com/rakan/default/NJGDZQ/San%20Francisco.jpg',
          },
        ],
        items: [
          {
            sku: null,
            module: null,
            standard: null,
            price: null,
            reserve: null,
            images: '//canarys.oss-cn-shanghai.aliyuncs.com/rakan/default/XPnkavz1/sparrow/hn_wssc.zip',
          }, {
            sku: null,
            module: null,
            standard: null,
            price: null,
            reserve: null,
            images: null,
          }
        ]
      };
      // }, 1)


      // if (localStorage.getItem('time') % 2 == 0) {
      //     this.form = {
      //         images: 'http://delii.oss-cn-shanghai.aliyuncs.com/rakan/default/NJGDZQ/San%20Francisco.jpg',
      //     }
      // } else {

      // }

    },
    clear() {
      this.form = {
        id: null,
        title: null,
        sort: 0,
        images: ''
      };
    },
    formatText(val) {
      if (!val) {
        return 'Enter value';
      }
      return val;
    },
    handleRemove(index) {
      this.form.items.splice(index, 1);
    },
    handleAdd() {
      this.form.items.push({
        sku: null,
        module: null,
        standard: null,
        price: null,
        reserve: null,
        images: null,
      });
    },
  }
}
</script>

<style>

</style>
