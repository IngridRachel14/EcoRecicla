export default function ChangePasswordModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-md">
        <h2 className="text-xl font-bold mb-4">Cambiar Contraseña</h2>
        <form className="space-y-4">
          <input type="password" placeholder="Contraseña actual" className="w-full border p-2 rounded" />
          <input type="password" placeholder="Nueva contraseña" className="w-full border p-2 rounded" />
          <input type="password" placeholder="Confirmar nueva contraseña" className="w-full border p-2 rounded" />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="bg-gray-300 px-4 py-2 rounded"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
