<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            class="input-with-select"
            v-model="queryinfo.query"
            clearable
            @clear="getGoodsList"
            @change="getGoodsList"
            @input="getGoodsList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getGoodsList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addGoods">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 数据表格 -->
      <el-table :data="goodsList" border>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name"></el-table-column>
        <el-table-column
          label="商品价格（元）"
          prop="goods_price"
          width="70px"
        ></el-table-column>
        <el-table-column
          label="商品重量"
          prop="goods_weight"
          width="70px"
        ></el-table-column>
        <el-table-column label="创建时间" prop="add_time" width="160px">
          <template slot-scope="scope">
            {{ scope.row.add_time | dataformat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150px">
          <template slot-scope="scope">
          <el-button type="primary" sizi="mini" icon="el-icon-edit"></el-button>
          <el-button
            type="danger"
            sizi="mini"
            icon="el-icon-delete"
            @click="deleteGoods(scope.row.goods_id)"
          ></el-button>
            </template>
            </el-table-column>
            </el-table></el-card>
  </div>
</template>
        </el-table-column>
      </el-table>
      <!-- 底部分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryinfo.pagenum"
        :page-sizes="[10, 15, 30, 60]"
        :page-size="queryinfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
  </div>
</template>add

<script>
export default {
  name: "goodslist",
  data() {
    return {
      queryinfo: {
        query: "",
        pagenum: 1,
        pagesize: 10,
      },
      goodsList: [],
      total: 0,
    };
  },
  created() {
    this.getGoodsList();
  },
  methods: {
    async getGoodsList() {
      const { data: res } = await this.$http.get("goods", {
        params: this.queryinfo,
      });
      if (res.meta.status !== 200) {
        return this.$message.error("请求商品列表失败");
      } else {
        console.log(res.data);
        this.total = res.data.total;
        this.goodsList = res.data.goods;
      }
    },
    handleSizeChange(newsize) {
      this.queryinfo.pagesize = newsize;
      this.getGoodsList();
    },
    handleCurrentChange(newcurrent) {
      this.queryinfo.pagenum = newcurrent;
      this.getGoodsList();
    },
    async deleteGoods(id) {
      const confirmresolt = await this.$confirm(
        "此操作将永久删除该文件, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      console.log(confirmresolt);
      if (confirmresolt !== "confirm") {
        return this.$message.info("已取消删除");
      } else {
        const {data: res} = await this.$http.delete(`goods/${id}`);
        if(res.meta.status !== 200){
            this.$message.error('删除失败')
        }else{
            this.$message.success('删除成功')
            this.getGoodsList()
        }
      }
    },
    addGoods(){
        this.$router.push('/goods/add')
    }
  },
};
</script>

<style lang="less" scope>
</style>