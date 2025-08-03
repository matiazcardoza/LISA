import api from "@/axios.js";

class InspetoresService {
    static async get(){
        return (await api.get(`inspectores`)).data;
    }

    static async save(params) {
        if(!params.id){
            return (await api.post(`inspectores`, params)).data;
        }else{
            return (await api.put(`inspectores/${params.id}`, params)).data;
        }
    }

    static async eliminar(id){
        return (await api.delete(`inspectores/${id}`)).data;
    }
}
export default InspetoresService;