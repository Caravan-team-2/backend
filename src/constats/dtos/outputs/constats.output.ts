import { WithPaginatedItems } from 'src/common/dtos/parginationRes.dto';
import { Constat } from 'src/constats/entities/constat.entity';

export class PaginatedConstats extends WithPaginatedItems(Constat) {}
