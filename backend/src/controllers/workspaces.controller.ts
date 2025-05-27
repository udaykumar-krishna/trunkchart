// src/controllers/workspace.controller.ts

import { Request, Response } from 'express';
import { db } from '../config/db.config';
import { v4 as uuidv4 } from 'uuid';

export class WorkspaceController {
  static async createWorkspace(req: Request, res: Response) {
    try {
      const { name, description, subdomain, owner_id, workspace_id, members } = req.body;

      if (!workspace_id) {
        if (!name || !description || !subdomain || !owner_id) {
          return res.status(400).json({ message: 'Missing workspace details' })
        }
        const newWorkspaceId = uuidv4();
        const createdAt = new Date().toISOString().slice(0, 19).replace('T', ' ');

        // Insert into 'workspaces' table
        await db('workspaces').insert({
          id: newWorkspaceId,
          name,
          description,
          subdomain,
          owner_id,
          created_at: createdAt,
        });

        // Prepare and insert members
        const workspaceMembers = members.map((member: any) => ({
          workspace_id: newWorkspaceId,
          user_id: member.userId,
          role: member.role || 'member',
          title: member.title || '',
          department: member.department || '',
          created_at: createdAt,
        }));

        if (workspaceMembers.length > 0) {
          await db('workspace_members').insert(workspaceMembers);
        }

        return res.status(201).json({
          message: 'Workspace created successfully',
          workspaceId: newWorkspaceId
        });
      }else {
        // Validate input
        if (!Array.isArray(members)) {
          return res.status(400).json({ message: 'Invalid input' });
        }

        const createdAt = new Date().toISOString().slice(0, 19).replace('T', ' ');

        if (workspace_id) {
          const workspaceExists = await db('workspaces').where({ id: workspace_id }).first();
          if (!workspaceExists) {
            return res.status(404).json({ message: 'Workspaces not found' })
          }

          const existingUserIds = await db('workspace_members')
            .where({ workspace_id })
            .pluck('user_id');

          const newMembers = members
            .filter((member: any) => !existingUserIds.includes(member.userId))
            .map((member: any) => ({
              workspace_id,
              user_id: member.userId,
              role: member.role || 'member',
              title: member.title || '',
              department: member.department || '',
              created_at: createdAt,
            }))

          if (newMembers.length > 0) {
            await db('workspace_members').insert(newMembers);
          }

          return res.status(200).json({
            message: 'Users added to existing workspace',
            workspaceId: workspace_id
          });
        }
      }
    } catch (err) {
      console.error('Error creating workspace:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async getAllWorkspaces(req: Request, res: Response) {
    try {
      const workspaces = await db('workspaces').select('id', 'name', 'subdomain');
      return res.status(200).json(workspaces);
    } catch (error) {
      console.log('Error fetching workspaces: ', error)
    }
  }

  static async getCurrentWorkspace(req: Request, res: Response) {
    const { userId } = req.params;

    try {
      const workspace = await db('workspaces')
        .join('workspace_members', 'workspaces.id', 'workspace_members.workspace_id')
        .where('workspace_members.user_id', userId)
        .select('workspaces.id', 'workspaces.name', 'workspaces.description')
        .first();

      if (!workspace) {
        return res.status(404).json({ message: 'No workspace found for this user' })
      }

      return res.json({ workspace });
    } catch (err) {
      console.log('Error fetching current workspace: ',err);
      return res.status(500).json({ message: 'Internal server error' })
    }
  }
};
