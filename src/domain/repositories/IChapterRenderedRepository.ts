/**
 * Interface do Repositório de Capítulos Renderizados
 * 
 * Define o contrato para persistência de versões HTML pré-processadas dos capítulos.
 */

import { ChapterId } from '@/domain/entities/Chapter';

export interface ChapterRendered {
  chapterId: ChapterId;
  renderedHtml: string;
  renderedAt: Date;
  updatedAt: Date;
}

export interface IChapterRenderedRepository {
  /**
   * Salvar ou atualizar versão renderizada de um capítulo
   */
  save(chapterId: ChapterId, renderedHtml: string): Promise<void>;

  /**
   * Buscar versão renderizada por ID do capítulo
   */
  findByChapterId(chapterId: ChapterId): Promise<ChapterRendered | null>;

  /**
   * Deletar versão renderizada (quando capítulo é deletado)
   */
  delete(chapterId: ChapterId): Promise<void>;
}
