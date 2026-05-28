import { User } from '@supabase/supabase-js';
import * as express from 'express';

declare global {
    namespace Express {
        interface Request {
            user?: User & {
                appUserId: number;  // Id del usuario en la base de datos
                isAdmin: boolean;   // Propiedad para verificar si es admin
            };
            files?: MulterFile[]; // si usas upload.array(...)
            file?: MulterFile;
        }
    }
}
