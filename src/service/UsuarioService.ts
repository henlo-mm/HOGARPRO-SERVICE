import { AppDataSource } from "../data-source";
import { Usuario } from "../entity/Usuario";
import { PublicUserInfo } from "../interface/PublicUserInfo";

const userRepository = AppDataSource.getRepository(Usuario);

export async function all(): Promise<Usuario[]> {
    return userRepository.find();
};

export async function findById(id: string): Promise<Usuario> {
    return userRepository.findOneBy({ celular: id });
};

export async function findPublicInfo(id: string): Promise<PublicUserInfo> {
    if (!id) return null;
    const user = await userRepository
        .createQueryBuilder("Usuario")
        .where("Usuario.celular = :id", { id: id })
        .getOne();
    if (!user) return null;
    let [cantidad, promedio] = await getEmployeeRatingCountAndAvg(id);
    const result: PublicUserInfo = {
        celular: user.celular,
        tipoDocumento: user.tipoDocumento,
        documento: user.documento,
        correoElectronico: user.correoElectronico,
        nombreCompleto: user.nombre + ' ' + user.apellido,
        fechaNacimiento: user.fechaNacimiento,
        fotoPerfil: user.fotoPerfil,
        numeroEstrellas: cantidad,
        promedioEstrellas: promedio
    }
    return result;
};

export async function findUserById(id: string): Promise<Usuario> {
    if (!id) return null;
    return userRepository
        .createQueryBuilder("Usuario")
        .where("Usuario.celular = :id", { id: id })
        .getOne()

};

export async function save(usuario: Usuario) {
    await userRepository.save(usuario);
}

async function getEmployeeRatingCountAndAvg(id: string): Promise<[number, number]> {
    const raw = await userRepository.query(
        "select coalesce(sum(s.calificacion),0) as sum , coalesce(avg(s.calificacion),0) as avg from hogar_pro.servicios s where s.id_trabajador = $1 and s.calificacion is not null", [id]
    );
    const result = raw[0];
    return [parseFloat(result.sum), parseFloat(result.avg)];
}

export async function validateTrabajadorDisponible(idUsuario: string) {
    console.log("Validando DIsponibilidad de Trabajador: " + idUsuario)
    const user = await userRepository.findOne(
        {
            where: {
                celular: idUsuario
            }
        });
    if (user) {
        if (user.fotoPerfil && user.fotoDocumento) {
            const raw = await userRepository.query(
                " select count(1) from hogar_pro.servicios s where s.id_trabajador = $1 and estado = 'EN PROCESO'",
                [user.celular]
            );
            const result = raw[0];
            if (parseInt(result.cantidad) < 1) {
                await userRepository.update({ celular: idUsuario }, { estado: "DISPONIBLE" });
            }
        }
    } else {
        return null;
    }
}