import api from "@/axios.js";

class VehiculosService {
    static async get(){
        return (await api.get(`vehiculos`)).data;
    }

    static async save(params) {
        if(!params.id){
            return (await api.post(`vehiculos`, params)).data;
        }else{
            return (await api.put(`vehiculos/${params.id}`, params)).data;
        }
    }

    static async eliminar(id){
        return (await api.delete(`vehiculos/${id}`)).data;
    }
}
export default VehiculosService;