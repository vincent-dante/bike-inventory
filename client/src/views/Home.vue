<template>
  <div>
    <div class="home">

      <br>
      <br>

      <div class="row">      
        <div class="col">
          <select 
            class="form-select form-select-sm" 
            aria-label=".form-select-sm"
            v-model="searchForm.categoryId"
            @change="getBikes"
          >
            <option selected value="">Category</option>
            <option 
              v-for="(cat, id) in categoryList"
              :key="id"
              :value=cat.category_id
            >
              {{ cat.category_name }}
            </option>
          </select>
        </div>
        <div class="col">
          <select 
            class="form-select form-select-sm" 
            aria-label=".form-select-sm "
            v-model="searchForm.supplierId"
            @change="getBikes"
          >
            <option selected value="">Supplier</option>
            <option 
              v-for="(supp, id) in supplierList"
              :key="id"
              :value="supp.supplier_id"
            >
              {{ supp.supplier_name }}
            </option>
          </select>
        </div>
        <div class="col">
          <div class="input-group input-group-sm mb-3 search-container">
            <input 
              type="text" 
              class="form-control" 
              placeholder="Search Bike name here..."
              v-model="searchForm.searchText"
              @keyup="getBikes"
            >
          </div>
        </div>
      </div>

      <br>

      <div class="d-flex flex-wrap justify-content-between">
        <div>
          <button 
            type="button"  
            class="btn btn-danger btn-sm" 
            @click="openDialogModal"
          >
            <i class="bi bi-trash"></i>
            Delete
          </button>
        </div>
        <div>
          <button
            type="button" 
            value="Add" 
            class="btn btn-primary btn-sm" 
            @click="addItem"
          >
            <i class="bi bi-plus-circle"></i> 
            Add Item
          </button>
        </div>
      </div>

      <br>

      <table class="table table-striped table-hover table-sm table-bordered">
        <thead class="table-dark">
          <tr>
            <th scope="col" class="text-center">#</th>
            <th scope="col">Name</th>
            <th scope="col">Category</th>
            <th scope="col">Supplier</th>
            <th scope="col" class="text-center">Purchase Cost</th>
            <th scope="col" class="text-center">Selling Price</th>
            <th scope="col" class="text-center">Quantity on Hand</th>
          </tr>
        </thead>
        <tbody>  
          <tr v-for="(data, id) in data" :key="id" @click="getRowData(data)">
            <th scope="row" @click.stop class="th-firstrow">
              <input type="checkbox" name="" id="" v-model="deleteList" :value="data.bike_id">
            </th>
            <td>{{ data.bike_name }}</td>
            <td>{{ data.category_name }}</td>
            <td>{{ data.supplier_name }}</td>
            <td class="text-center">{{ data.purchase_cost }}</td>
            <td class="text-center">{{ data.selling_price }}</td>
            <td class="text-center">{{ data.quantity_on_hand }}</td>          
          </tr>
        </tbody>
      </table>  
    </div>


    <!--- Modal Form --->
    <div class="modal fade" id="formModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="modalLabel">{{ modalTitle }}</h5>
            <button type="button" class="btn-close btn-sm" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label for="bikeName" class="form-label">Bike Name</label>
              <div class="input-group input-group-sm">
                <input type="text" class="form-control" id="bikeName" v-model="formData.bikeName">
              </div>
              <div class="form-text text-danger" v-if="showRequired">*Required Field</div>
            </div>
            <div class="mb-3">
              <label class="form-label">Category</label>
              <select 
                class="form-select form-select-sm" 
                aria-label=".form-select-sm "
                v-model="formData.categoryId"
                required
              >
                <option selected disabled value="">Category</option>
                <option 
                  v-for="(cat, id) in categoryList"
                  :key="id"
                  :value=cat.category_id
                >
                  {{ cat.category_name }}
                </option>
              </select>
              <div class="form-text text-danger" v-if="showRequired">*Required Field</div>
            </div>
            <div class="mb-3">
              <label class="form-label">Supplier</label>
              <select 
                class="form-select form-select-sm" 
                aria-label=".form-select-sm "
                v-model="formData.supplierId"
              >
                <option selected disabled value="">Supplier</option>
                <option 
                  v-for="(supp, id) in supplierList"
                  :key="id"
                  :value="supp.supplier_id"
                >
                  {{ supp.supplier_name }}
                </option>
              </select>
              <div class="form-text text-danger" v-if="showRequired">*Required Field</div>
            </div>
            <div class="mb-3">
              <label for="purchaseCost" class="form-label">Purchase Cost</label>
              <div class="input-group input-group-sm mb-3">
                <input type="text" class="form-control" id="purchaseCost" v-model="formData.purchaseCost">
              </div>
            </div>
            <div class="mb-3">
              <label for="sellingPrice" class="form-label">Selling Price</label>
              <div class="input-group input-group-sm mb-3">
                <input type="text" class="form-control" id="sellingPrice" v-model="formData.sellingPrice">
              </div>
            </div>
            <div class="mb-3">
              <label for="quantityOnHand" class="form-label">Quantity On Hand</label>
              <div class="input-group input-group-sm mb-3">
                <input type="text" class="form-control" id="quantityOnHand" v-model="formData.quantityOnHand">
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary btn-sm" data-bs-dismiss="modal">Close</button>
            <button 
              type="button" 
              class="btn btn-primary btn-sm" 
              @click="submitForm"
            >
              {{ submitButtonText }}
            </button>
          </div> 
        </div>
      </div>
    </div>

    <!-- Dialog Modal -->
    <div class="modal fade" id="dialogModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="btn-close btn-sm" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body text-center">
            {{ messageModal.message }}
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary btn-sm" data-bs-dismiss="modal">Close</button>
            <button 
              type="button" 
              class="btn btn-danger btn-sm"
              v-if="messageModal.condition === 'delete'"
              @click="deleteSubmit"
              >Delete</button>
          </div>
        </div>
      </div>
    </div>


  </div>
</template>

<script>
// @ is an alias to /src
import axios from 'axios'
import { Modal } from 'bootstrap'


export default {
  name: 'Home',
  data(){
    return {
      data: [],
      formData: {
        bikeId: '',
        bikeName: '',
        categoryId: '',
        supplierId: '',
        purchaseCost: '',
        sellingPrice: '',
        quantityOnHand: ''
      },
      searchForm: {
        categoryId: '',
        supplierId: '',
        searchText: ''
      },
      submitCondition: 'add',
      formModal: null,
      categoryList: null,
      supplierList: null,
      deleteList: [],
      messageModal: {
        condition: '',
        message: ''
      },
      showRequired: false
    }
  },
  mounted(){

    this.getBikes();
    this.getCategoryList();
    this.getSupplierList();

    this.formModal = new Modal(document.getElementById('formModal'), {
      keyboard: false
    });
    this.dialogModal = new Modal(document.getElementById('dialogModal'), {
      keyboard: false
    });

  },
  methods: {

    getBikes(){
      axios
      .get(`/bike`, {
        params: {
          search: this.searchForm.searchText,
          category: this.searchForm.categoryId,
          supplier: this.searchForm.supplierId
        }
      })
      .then( response => {
        this.data = response.data;
      })
      .catch( err => console.error(err) ) 

    },
    getRowData(d){

      const form = this.formData;

      form.bikeId = d.bike_id;
      form.bikeName = d.bike_name;
      form.categoryId = d.category_id;
      form.supplierId = d.supplier_id;
      form.purchaseCost = d.purchase_cost;
      form.sellingPrice = d.selling_price;
      form.quantityOnHand = d.quantity_on_hand;

      this.submitCondition = 'edit';
      this.showRequired = false;
      this.formModal.show();

    },
    addItem(){ //Clear Input for Add Form

      const data = this.formData;

      for (const key in data) {
        data[key] = '';
      }

      this.submitCondition = 'add';
      this.showRequired = false;
      this.formModal.show();

    },
    submitForm(){

      if (
          this.formData.bikeName.length < 1 ||
          this.formData.categoryId.length < 1 ||
          this.formData.supplierId.length < 1
        )
      {
        this.showRequired = true;
      } 
      else {

        if(this.submitCondition === 'add'){
          this.addSubmit();
        } else {
          this.updateSubmit();
        }
      }

    },
    addSubmit(){
      const modal = this.formModal;
      const realoadTable = this.getBikes;

      axios
      .post('/bike/add', {
        data: this.formData
      })
      .then(function () {
        realoadTable();
        modal.hide();
      })
      .catch(function (error) {
        console.log(error);
      });

    },
    updateSubmit(){
      const modal = this.formModal;
      const realoadTable = this.getBikes;

      axios
      .put(`/bike/update`, {
        data: this.formData
      })
      .then(function () {
        realoadTable();
        modal.hide();
      })
      .catch(function (error) {
        console.log(error);
      });

    },
    deleteSubmit(){

      const modal = this.dialogModal;
      const realoadTable = this.getBikes;
      let list = this.deleteList;

      axios
      .delete('/bike/delete', {
        data: list
      })
      .then(function () {
        realoadTable();
        list.splice(0);
        modal.hide();
      })
      .catch(function (error) {
        console.log(error);
      });

    },
    getCategoryList(){

      axios
      .get(`/bike/category`)
      .then( response => {
        this.categoryList = response.data;
      })
      .catch( err => console.error(err) ) 

    },
    getSupplierList(){

      axios
      .get(`/bike/supplier`)
      .then( response => {
        this.supplierList = response.data;
      })
      .catch( err => console.error(err) ) 

    },
    openDialogModal(){

      if(this.deleteList.length < 1){
        this.messageModal.condition = 'dialog';
        this.messageModal.message = 'Please select some data';
      }
      else {
        this.messageModal.condition = 'delete';
        this.messageModal.message = 'Are you sure you want to Delete?';
      }

      this.dialogModal.show();
    }

  },
  computed: {

    modalTitle(){
      return this.submitCondition === 'add' ? 'Add Item' : 'Edit Item';
    },
    submitButtonText(){
      return this.submitCondition === 'add' ? 'Save' : 'Update';
    }

  }
}
</script>

<style scoped>
.filter-container >  :not(:last-child) { 
  margin-right: 20px;
}
td:hover {
  cursor: pointer;
}
.th-firstrow {
  text-align: center;
  cursor: pointer;
  width: 50px;
}
</style>

